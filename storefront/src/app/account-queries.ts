import { executeGraphQL } from "@/lib/graphql";

// GraphQL query to fetch user orders with full details
const UserOrdersDocument = `
  query UserOrders($channel: String!) {
    me {
      id
      email
      firstName
      lastName
      orders(first: 50, channel: $channel) {
        edges {
          node {
            id
            number
            created
            status
            statusDisplay
            paymentStatus
            paymentStatusDisplay
            total {
              gross {
                amount
                currency
              }
            }
            subtotal {
              gross {
                amount
                currency
              }
            }
            shippingPrice {
              gross {
                amount
                currency
              }
            }
            lines {
              id
              productName
              variantName
              quantity
              unitPrice {
                gross {
                  amount
                  currency
                }
              }
              totalPrice {
                gross {
                  amount
                  currency
                }
              }
              thumbnail {
                url
                alt
              }
            }
            shippingAddress {
              firstName
              lastName
              streetAddress1
              streetAddress2
              city
              countryArea
              postalCode
              phone
              country {
                code
                country
              }
            }
            billingAddress {
              firstName
              lastName
              streetAddress1
              streetAddress2
              city
              countryArea
              postalCode
              phone
            }
            trackingClientId
          }
        }
      }
    }
  }
`;

// GraphQL query to fetch single order details
const OrderDetailsDocument = `
  query OrderDetails($id: ID!) {
    order(id: $id) {
      id
      number
      created
      status
      statusDisplay
      paymentStatus
      paymentStatusDisplay
      total {
        gross {
          amount
          currency
        }
      }
      subtotal {
        gross {
          amount
          currency
        }
      }
      shippingPrice {
        gross {
          amount
          currency
        }
      }
      lines {
        id
        productName
        variantName
        quantity
        variant {
          id
          product {
            slug
          }
        }
        unitPrice {
          gross {
            amount
            currency
          }
        }
        totalPrice {
          gross {
            amount
            currency
          }
        }
        thumbnail {
          url
          alt
        }
      }
      shippingAddress {
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
        countryArea
        postalCode
        phone
        country {
          code
          country
        }
      }
      billingAddress {
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
        countryArea
        postalCode
        phone
      }
      trackingClientId
      invoices {
        id
        url
        number
      }
    }
  }
`;

// GraphQL query to fetch user wishlist
const UserWishlistDocument = `
  query UserWishlist {
    me {
      id
      wishlist {
        id
        name
        slug
        thumbnail {
          url
          alt
        }
        pricing {
          priceRange {
            start {
              gross {
                amount
                currency
              }
            }
          }
        }
      }
    }
  }
`;

// GraphQL query to fetch user addresses
const UserAddressesDocument = `
  query UserAddresses {
    me {
      id
      addresses {
        id
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
        postalCode
        country {
          code
          country
        }
        phone
        isDefaultBillingAddress
        isDefaultShippingAddress
      }
      defaultBillingAddress {
        id
      }
      defaultShippingAddress {
        id
      }
    }
  }
`;

// GraphQL mutation to add address
const AddAddressDocument = `
  mutation AddAddress($address: AddressInput!) {
    accountAddressCreate(input: $address) {
      address {
        id
        firstName
        lastName
        streetAddress1
        city
      }
      errors {
        field
        message
      }
    }
  }
`;

// GraphQL mutation to update address
const UpdateAddressDocument = `
  mutation UpdateAddress($id: ID!, $address: AddressInput!) {
    accountAddressUpdate(id: $id, input: $address) {
      address {
        id
        firstName
        lastName
        streetAddress1
        city
      }
      errors {
        field
        message
      }
    }
  }
`;

// GraphQL mutation to delete address
const DeleteAddressDocument = `
  mutation DeleteAddress($id: ID!) {
    accountAddressDelete(id: $id) {
      address {
        id
      }
      errors {
        field
        message
      }
    }
  }
`;

// GraphQL mutation to set default address
const SetDefaultAddressDocument = `
  mutation SetDefaultAddress($id: ID!, $type: AddressTypeEnum!) {
    accountSetDefaultAddress(id: $id, type: $type) {
      user {
        id
      }
      errors {
        field
        message
      }
    }
  }
`;

// GraphQL mutation to add product to wishlist
const AddToWishlistDocument = `
  mutation AddToWishlist($productId: ID!) {
    wishlistAddProduct(productId: $productId) {
      wishlist {
        id
      }
      errors {
        field
        message
      }
    }
  }
`;

// GraphQL mutation to remove from wishlist
const RemoveFromWishlistDocument = `
  mutation RemoveFromWishlist($productId: ID!) {
    wishlistRemoveProduct(productId: $productId) {
      wishlist {
        id
      }
      errors {
        field
        message
      }
    }
  }
`;

// Fetch user orders
export async function getUserOrders(channel: string) {
	try {
		const { me } = await executeGraphQL(UserOrdersDocument, {
			variables: { channel },
			cache: "no-store",
		});

		if (!me || !me.orders) {
			return [];
		}

		return me.orders.edges.map(({ node }: any) => ({
			id: node.id,
			number: node.number,
			created: node.created,
			status: node.status,
			statusDisplay: node.statusDisplay,
			paymentStatus: node.paymentStatus,
			paymentStatusDisplay: node.paymentStatusDisplay,
			total: node.total,
			subtotal: node.subtotal,
			shippingPrice: node.shippingPrice,
			lines: node.lines.map((line: any) => ({
				id: line.id,
				productName: line.productName,
				variantName: line.variantName,
				quantity: line.quantity,
				unitPrice: line.unitPrice,
				totalPrice: line.totalPrice,
				thumbnail: line.thumbnail,
			})),
			shippingAddress: node.shippingAddress,
			billingAddress: node.billingAddress,
			trackingClientId: node.trackingClientId,
		}));
	} catch (error) {
		console.error("Error fetching orders:", error);
		return [];
	}
}

// Fetch single order details
export async function getOrderDetails(orderId: string) {
	try {
		const { order } = await executeGraphQL(OrderDetailsDocument, {
			variables: { id: orderId },
			cache: "no-store",
		});

		if (!order) {
			return null;
		}

		return {
			id: order.id,
			number: order.number,
			created: order.created,
			status: order.status,
			statusDisplay: order.statusDisplay,
			paymentStatus: order.paymentStatus,
			paymentStatusDisplay: order.paymentStatusDisplay,
			total: order.total,
			subtotal: order.subtotal,
			shippingPrice: order.shippingPrice,
			lines: order.lines.map((line: any) => ({
				id: line.id,
				productName: line.productName,
				variantName: line.variantName,
				productSlug: line.variant?.product?.slug,
				quantity: line.quantity,
				unitPrice: line.unitPrice,
				totalPrice: line.totalPrice,
				thumbnail: line.thumbnail,
			})),
			shippingAddress: order.shippingAddress,
			billingAddress: order.billingAddress,
			trackingClientId: order.trackingClientId,
			invoices: order.invoices,
		};
	} catch (error) {
		console.error("Error fetching order details:", error);
		return null;
	}
}

// Fetch user wishlist
export async function getUserWishlist() {
	try {
		const { me } = await executeGraphQL(UserWishlistDocument, {
			cache: "no-store",
		});

		if (!me || !me.wishlist) {
			return [];
		}

		return me.wishlist.map((product: any) => ({
			id: product.id,
			name: product.name,
			slug: product.slug,
			thumbnail: product.thumbnail?.url,
			price: product.pricing?.priceRange?.start?.gross.amount,
			currency: product.pricing?.priceRange?.start?.gross.currency,
		}));
	} catch (error) {
		console.error("Error fetching wishlist:", error);
		return [];
	}
}

// Fetch user addresses
export async function getUserAddresses() {
	try {
		const { me } = await executeGraphQL(UserAddressesDocument, {
			cache: "no-store",
		});

		if (!me || !me.addresses) {
			return { addresses: [], defaultBilling: null, defaultShipping: null };
		}

		return {
			addresses: me.addresses,
			defaultBilling: me.defaultBillingAddress?.id,
			defaultShipping: me.defaultShippingAddress?.id,
		};
	} catch (error) {
		console.error("Error fetching addresses:", error);
		return { addresses: [], defaultBilling: null, defaultShipping: null };
	}
}

// Add new address
export async function addAddress(address: any) {
	try {
		const { accountAddressCreate } = await executeGraphQL(AddAddressDocument, {
			variables: { address },
			cache: "no-store",
		});

		if (accountAddressCreate.errors.length > 0) {
			return {
				success: false,
				errors: accountAddressCreate.errors.map((e: any) => e.message),
			};
		}

		return { success: true, address: accountAddressCreate.address };
	} catch (error) {
		console.error("Error adding address:", error);
		return { success: false, errors: ["Failed to add address"] };
	}
}

// Update existing address
export async function updateAddress(id: string, address: any) {
	try {
		const { accountAddressUpdate } = await executeGraphQL(UpdateAddressDocument, {
			variables: { id, address },
			cache: "no-store",
		});

		if (accountAddressUpdate.errors.length > 0) {
			return {
				success: false,
				errors: accountAddressUpdate.errors.map((e: any) => e.message),
			};
		}

		return { success: true, address: accountAddressUpdate.address };
	} catch (error) {
		console.error("Error updating address:", error);
		return { success: false, errors: ["Failed to update address"] };
	}
}

// Delete address
export async function deleteAddress(id: string) {
	try {
		const { accountAddressDelete } = await executeGraphQL(DeleteAddressDocument, {
			variables: { id },
			cache: "no-store",
		});

		if (accountAddressDelete.errors.length > 0) {
			return {
				success: false,
				errors: accountAddressDelete.errors.map((e: any) => e.message),
			};
		}

		return { success: true };
	} catch (error) {
		console.error("Error deleting address:", error);
		return { success: false, errors: ["Failed to delete address"] };
	}
}

// Set default address
export async function setDefaultAddress(id: string, type: "BILLING" | "SHIPPING") {
	try {
		const { accountSetDefaultAddress } = await executeGraphQL(SetDefaultAddressDocument, {
			variables: { id, type },
			cache: "no-store",
		});

		if (accountSetDefaultAddress.errors.length > 0) {
			return {
				success: false,
				errors: accountSetDefaultAddress.errors.map((e: any) => e.message),
			};
		}

		return { success: true };
	} catch (error) {
		console.error("Error setting default address:", error);
		return { success: false, errors: ["Failed to set default address"] };
	}
}

// Add to wishlist
export async function addToWishlist(productId: string) {
	try {
		const { wishlistAddProduct } = await executeGraphQL(AddToWishlistDocument, {
			variables: { productId },
			cache: "no-store",
		});

		if (wishlistAddProduct.errors.length > 0) {
			return {
				success: false,
				errors: wishlistAddProduct.errors.map((e: any) => e.message),
			};
		}

		return { success: true };
	} catch (error) {
		console.error("Error adding to wishlist:", error);
		return { success: false, errors: ["Failed to add to wishlist"] };
	}
}

// Remove from wishlist
export async function removeFromWishlist(productId: string) {
	try {
		const { wishlistRemoveProduct } = await executeGraphQL(RemoveFromWishlistDocument, {
			variables: { productId },
			cache: "no-store",
		});

		if (wishlistRemoveProduct.errors.length > 0) {
			return {
				success: false,
				errors: wishlistRemoveProduct.errors.map((e: any) => e.message),
			};
		}

		return { success: true };
	} catch (error) {
		console.error("Error removing from wishlist:", error);
		return { success: false, errors: ["Failed to remove from wishlist"] };
	}
}
