"""
GraphQL Query Cost Analysis and Complexity Limiting

Prevents expensive queries from overloading the server by:
- Limiting query depth (nested levels)
- Calculating query complexity cost
- Rejecting queries that exceed thresholds

This protects against:
- Deeply nested queries that cause N+1 problems
- Queries requesting too many fields
- Malicious queries attempting DoS
"""

from typing import Any

from graphql import GraphQLError
from graphql.language import ast
from graphql.validation import ValidationRule


class QueryDepthAnalyzer(ValidationRule):
    """
    Limits the maximum depth of GraphQL queries.

    Example of depth:
        query {                     # depth 0
          products {                # depth 1
            variants {              # depth 2
              images {              # depth 3  <- Would be rejected if max_depth=2
                url
              }
            }
          }
        }
    """

    def __init__(self, max_depth: int, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.max_depth = max_depth
        self._current_depth = 0

    def enter_field(self, node: ast.FieldNode, *args):
        self._current_depth += 1

        if self._current_depth > self.max_depth:
            raise GraphQLError(
                f"Query depth of {self._current_depth} exceeds maximum allowed depth of {self.max_depth}. "
                "Please simplify your query by reducing nesting levels.",
                nodes=[node],
            )

    def leave_field(self, *args):
        self._current_depth -= 1


class QueryComplexityAnalyzer(ValidationRule):
    """
    Calculates and limits the complexity cost of GraphQL queries.

    Each field has a cost:
    - Simple fields (id, name): cost 1
    - List fields (products, orders): cost 10 * limit
    - Nested lists: multiply costs

    Example:
        query {
          products(first: 100) {    # cost: 100
            variants(first: 10) {   # cost: 100 * 10 = 1,000
              id                    # cost: 1
              name                  # cost: 1
            }
          }
        }
        Total: 1,102 (might exceed threshold)
    """

    def __init__(self, max_complexity: int, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.max_complexity = max_complexity
        self._complexity = 0

    def enter_field(self, node: ast.FieldNode, *args):
        # Get field complexity
        field_complexity = self._calculate_field_complexity(node)
        self._complexity += field_complexity

        if self._complexity > self.max_complexity:
            raise GraphQLError(
                f"Query complexity of {self._complexity} exceeds maximum allowed complexity of {self.max_complexity}. "
                "Please reduce the number of requested fields or limit the amount of data requested.",
                nodes=[node],
            )

    def _calculate_field_complexity(self, node: ast.FieldNode) -> int:
        """Calculate the complexity cost of a field."""
        # Base cost for any field
        cost = 1

        # Check for pagination arguments (first, last)
        if node.arguments:
            for arg in node.arguments:
                if arg.name.value in ("first", "last"):
                    # List queries cost more based on limit
                    if hasattr(arg.value, "value"):
                        limit = int(arg.value.value)
                        cost = min(limit, 100)  # Cap at 100 to avoid overflow

        # Connection/Edge patterns (Relay pagination)
        if node.name.value.endswith("Connection") or node.name.value in (
            "edges",
            "node",
        ):
            cost *= 10  # Connection queries are more expensive

        return cost


class QueryCostValidator:
    """
    Combined validator that checks both depth and complexity.

    Usage in GraphQL schema:
        validator = QueryCostValidator(max_depth=10, max_complexity=5000)
        validation_rules = validator.get_validation_rules()
    """

    def __init__(
        self,
        max_depth: int = 10,
        max_complexity: int = 5000,
    ):
        """
        Initialize query cost validator.

        Args:
            max_depth: Maximum allowed query nesting depth (default: 10)
            max_complexity: Maximum allowed query complexity score (default: 5000)
        """
        self.max_depth = max_depth
        self.max_complexity = max_complexity

    def get_validation_rules(self) -> list[type[ValidationRule]]:
        """Get list of validation rules to apply."""
        return [
            lambda *args, **kwargs: QueryDepthAnalyzer(
                self.max_depth, *args, **kwargs
            ),
            lambda *args, **kwargs: QueryComplexityAnalyzer(
                self.max_complexity, *args, **kwargs
            ),
        ]

    def analyze_query(self, query_document: ast.DocumentNode) -> dict[str, Any]:
        """
        Analyze a query and return statistics without rejecting it.

        Useful for logging and monitoring query patterns.
        """
        depth = self._calculate_query_depth(query_document)
        complexity = self._calculate_query_complexity(query_document)

        return {
            "depth": depth,
            "complexity": complexity,
            "within_limits": (
                depth <= self.max_depth and complexity <= self.max_complexity
            ),
        }

    def _calculate_query_depth(self, document: ast.DocumentNode) -> int:
        """Calculate the maximum depth of a query document."""
        max_depth = 0

        def visit_node(node, depth=0):
            nonlocal max_depth
            max_depth = max(max_depth, depth)

            if hasattr(node, "selection_set") and node.selection_set:
                for selection in node.selection_set.selections:
                    if isinstance(selection, ast.FieldNode):
                        visit_node(selection, depth + 1)

        for definition in document.definitions:
            if isinstance(definition, ast.OperationDefinitionNode):
                visit_node(definition)

        return max_depth

    def _calculate_query_complexity(self, document: ast.DocumentNode) -> int:
        """Calculate the total complexity of a query document."""
        total_complexity = 0

        def visit_field(node, multiplier=1):
            nonlocal total_complexity

            # Base cost
            cost = 1

            # Check for list size arguments
            if node.arguments:
                for arg in node.arguments:
                    if arg.name.value in ("first", "last") and hasattr(
                        arg.value, "value"
                    ):
                        cost = min(int(arg.value.value), 100)

            total_complexity += cost * multiplier

            # Recursively visit nested fields
            if hasattr(node, "selection_set") and node.selection_set:
                for selection in node.selection_set.selections:
                    if isinstance(selection, ast.FieldNode):
                        visit_field(selection, multiplier * cost)

        for definition in document.definitions:
            if isinstance(definition, ast.OperationDefinitionNode):
                if definition.selection_set:
                    for selection in definition.selection_set.selections:
                        if isinstance(selection, ast.FieldNode):
                            visit_field(selection)

        return total_complexity


# Example usage
"""
CONFIGURATION:

1. In settings.py:

from saleor.graphql.query_cost_analysis import QueryCostValidator

# Query cost limits
GRAPHQL_QUERY_MAX_DEPTH = int(os.environ.get("GRAPHQL_QUERY_MAX_DEPTH", "10"))
GRAPHQL_QUERY_MAX_COMPLEXITY = int(os.environ.get("GRAPHQL_QUERY_MAX_COMPLEXITY", "5000"))

query_cost_validator = QueryCostValidator(
    max_depth=GRAPHQL_QUERY_MAX_DEPTH,
    max_complexity=GRAPHQL_QUERY_MAX_COMPLEXITY,
)

2. In GraphQL view:

from django.conf import settings

class GraphQLView(BaseGraphQLView):
    def execute_graphql_request(self, *args, **kwargs):
        # Add validation rules
        validation_rules = settings.query_cost_validator.get_validation_rules()

        # Execute with validation
        return super().execute_graphql_request(
            *args,
            validation_rules=validation_rules,
            **kwargs
        )

EXAMPLES:

1. Query that would be rejected (too deep):

query DeepNesting {
  products {                    # depth 1
    category {                  # depth 2
      parent {                  # depth 3
        parent {                # depth 4
          parent {              # depth 5
            parent {            # depth 6
              parent {          # depth 7
                parent {        # depth 8
                  parent {      # depth 9
                    parent {    # depth 10
                      parent {  # depth 11 - REJECTED!
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

2. Query that would be rejected (too complex):

query HighComplexity {
  products(first: 100) {        # cost: 100
    variants(first: 100) {      # cost: 100 * 100 = 10,000 - REJECTED!
      id
    }
  }
}

3. Safe query (within limits):

query SafeQuery {
  products(first: 20) {         # cost: 20
    id
    name
    variants(first: 5) {        # cost: 20 * 5 = 100
      id
      sku
    }
  }
}
# Total complexity: 120 (under 5000 limit)
# Max depth: 2 (under 10 limit)

MONITORING:

Add logging to track query patterns:

from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def log_query_cost(query_document):
    validator = settings.query_cost_validator
    stats = validator.analyze_query(query_document)

    logger.info(
        f"GraphQL Query Stats - Depth: {stats['depth']}, "
        f"Complexity: {stats['complexity']}, "
        f"Within Limits: {stats['within_limits']}"
    )

    if not stats['within_limits']:
        logger.warning("Query exceeded cost limits!")

RECOMMENDED LIMITS:

Environment   | Max Depth | Max Complexity | Notes
------------- | --------- | -------------- | -----
Development   | 15        | 10000          | More permissive for testing
Staging       | 12        | 7000           | Similar to production
Production    | 10        | 5000           | Protect against abuse
Public API    | 8         | 3000           | More restrictive for unknown clients

TUNING:

Monitor query patterns and adjust limits:

1. Too restrictive (legitimate queries rejected):
   - Increase limits gradually
   - Optimize query patterns in frontend
   - Use pagination more effectively

2. Too permissive (server strain):
   - Decrease limits
   - Add per-user rate limiting
   - Cache expensive queries
"""
