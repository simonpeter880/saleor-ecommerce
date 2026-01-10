import { DummyComponent } from "./DummyDropIn/dummyComponent";
import { dummyGatewayId } from "./DummyDropIn/types";
import { StripeComponent } from "./StripeV2DropIn/stripeComponent";
import { stripeV2GatewayId } from "./StripeV2DropIn/types";

export const paymentMethodToComponent = {
	[stripeV2GatewayId]: StripeComponent,
	[dummyGatewayId]: DummyComponent,
};
