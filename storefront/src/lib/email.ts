/**
 * Email Notification Utilities
 *
 * This module provides email notification functionality for various user actions
 * including order confirmations, shipping updates, account activities, etc.
 *
 * NOTE: These are template functions. In production, integrate with:
 * - Saleor's built-in email system
 * - SendGrid, Mailgun, or AWS SES
 * - Resend, Postmark, etc.
 */

interface EmailData {
	to: string;
	subject: string;
	html: string;
	text?: string;
}

interface OrderConfirmationData {
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	orderTotal: string;
	orderDate: string;
	items: Array<{
		name: string;
		quantity: number;
		price: string;
	}>;
	shippingAddress: string;
}

interface ShippingUpdateData {
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	trackingNumber?: string;
	status: string;
	estimatedDelivery?: string;
}

interface ReviewReminderData {
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	productName: string;
	productSlug: string;
}

interface WelcomeEmailData {
	customerName: string;
	customerEmail: string;
	verificationLink?: string;
}

interface PasswordResetData {
	customerName: string;
	customerEmail: string;
	resetLink: string;
}

/**
 * Send an email (mock implementation)
 * In production, replace with actual email service
 */
async function sendEmail(data: EmailData): Promise<boolean> {
	try {
		console.log("📧 Email would be sent:");
		console.log("To:", data.to);
		console.log("Subject:", data.subject);
		console.log("HTML:", data.html.substring(0, 100) + "...");

		// TODO: Integrate with email service
		// Example with SendGrid:
		// await sgMail.send({
		//   to: data.to,
		//   from: process.env.SENDER_EMAIL,
		//   subject: data.subject,
		//   html: data.html,
		//   text: data.text,
		// });

		// Example with Resend:
		// await resend.emails.send({
		//   from: process.env.SENDER_EMAIL,
		//   to: data.to,
		//   subject: data.subject,
		//   html: data.html,
		// });

		return true;
	} catch (error) {
		console.error("Failed to send email:", error);
		return false;
	}
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(data: OrderConfirmationData): Promise<boolean> {
	const html = `
<!DOCTYPE html>
<html>
<head>
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background: linear-gradient(to right, #FB7701, #FD8E1F); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
		.content { background: #fff; padding: 30px; border: 1px solid #ddd; }
		.order-details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
		.item { padding: 10px 0; border-bottom: 1px solid #eee; }
		.total { font-size: 1.2em; font-weight: bold; color: #FB7701; margin-top: 20px; }
		.button { display: inline-block; background: #FB7701; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
		.footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>✓ Order Confirmed!</h1>
			<p>Thank you for shopping with TechHub Electronics</p>
		</div>
		<div class="content">
			<h2>Hello ${data.customerName},</h2>
			<p>We've received your order and are getting it ready. We'll send you a shipping confirmation email when your items are on the way.</p>

			<div class="order-details">
				<h3>Order Details</h3>
				<p><strong>Order Number:</strong> ${data.orderNumber}</p>
				<p><strong>Order Date:</strong> ${data.orderDate}</p>

				<h4>Items:</h4>
				${data.items.map(item => `
					<div class="item">
						<strong>${item.name}</strong><br>
						Quantity: ${item.quantity} × ${item.price}
					</div>
				`).join('')}

				<div class="total">
					Total: ${data.orderTotal}
				</div>

				<h4>Shipping Address:</h4>
				<p>${data.shippingAddress}</p>
			</div>

			<a href="${process.env.NEXT_PUBLIC_STOREFRONT_URL}/orders/${data.orderNumber}" class="button">
				Track Your Order
			</a>
		</div>
		<div class="footer">
			<p>TechHub Electronics | Uganda's Premier Electronics Store</p>
			<p>Questions? Contact us at support@techhub.ug</p>
		</div>
	</div>
</body>
</html>
	`;

	return sendEmail({
		to: data.customerEmail,
		subject: `Order Confirmation - ${data.orderNumber}`,
		html,
	});
}

/**
 * Send shipping update email
 */
export async function sendShippingUpdateEmail(data: ShippingUpdateData): Promise<boolean> {
	const statusMessages = {
		PROCESSING: "Your order is being prepared",
		SHIPPED: "Your order has been shipped!",
		IN_TRANSIT: "Your order is on the way",
		OUT_FOR_DELIVERY: "Your order is out for delivery",
		DELIVERED: "Your order has been delivered",
	};

	const html = `
<!DOCTYPE html>
<html>
<head>
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background: linear-gradient(to right, #FB7701, #FD8E1F); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
		.content { background: #fff; padding: 30px; border: 1px solid #ddd; }
		.status-box { background: #e8f5e9; color: #2e7d32; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
		.button { display: inline-block; background: #FB7701; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
		.footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>📦 Order Update</h1>
		</div>
		<div class="content">
			<h2>Hello ${data.customerName},</h2>

			<div class="status-box">
				<h3>${statusMessages[data.status as keyof typeof statusMessages] || data.status}</h3>
				<p><strong>Order #${data.orderNumber}</strong></p>
				${data.trackingNumber ? `<p>Tracking Number: ${data.trackingNumber}</p>` : ''}
				${data.estimatedDelivery ? `<p>Estimated Delivery: ${data.estimatedDelivery}</p>` : ''}
			</div>

			<a href="${process.env.NEXT_PUBLIC_STOREFRONT_URL}/orders/${data.orderNumber}" class="button">
				Track Your Order
			</a>
		</div>
		<div class="footer">
			<p>TechHub Electronics | Uganda's Premier Electronics Store</p>
			<p>Questions? Contact us at support@techhub.ug</p>
		</div>
	</div>
</body>
</html>
	`;

	return sendEmail({
		to: data.customerEmail,
		subject: `Shipping Update - Order ${data.orderNumber}`,
		html,
	});
}

/**
 * Send review reminder email
 */
export async function sendReviewReminderEmail(data: ReviewReminderData): Promise<boolean> {
	const html = `
<!DOCTYPE html>
<html>
<head>
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background: linear-gradient(to right, #FB7701, #FD8E1F); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
		.content { background: #fff; padding: 30px; border: 1px solid #ddd; }
		.product-box { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
		.button { display: inline-block; background: #FB7701; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
		.stars { font-size: 24px; color: #FB7701; }
		.footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>⭐ How was your experience?</h1>
		</div>
		<div class="content">
			<h2>Hello ${data.customerName},</h2>
			<p>We hope you're enjoying your recent purchase! We'd love to hear what you think.</p>

			<div class="product-box">
				<h3>${data.productName}</h3>
				<p>Order #${data.orderNumber}</p>
				<div class="stars">★★★★★</div>
			</div>

			<p>Your feedback helps other customers make informed decisions and helps us improve our products and services.</p>

			<a href="${process.env.NEXT_PUBLIC_STOREFRONT_URL}/products/${data.productSlug}?writeReview=true" class="button">
				Write a Review
			</a>
		</div>
		<div class="footer">
			<p>TechHub Electronics | Uganda's Premier Electronics Store</p>
			<p>Not interested? You can unsubscribe from review reminders.</p>
		</div>
	</div>
</body>
</html>
	`;

	return sendEmail({
		to: data.customerEmail,
		subject: `How was your ${data.productName}?`,
		html,
	});
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
	const html = `
<!DOCTYPE html>
<html>
<head>
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background: linear-gradient(to right, #FB7701, #FD8E1F); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
		.content { background: #fff; padding: 30px; border: 1px solid #ddd; }
		.button { display: inline-block; background: #FB7701; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
		.benefits { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
		.footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>🎉 Welcome to TechHub!</h1>
		</div>
		<div class="content">
			<h2>Hello ${data.customerName},</h2>
			<p>Thank you for joining TechHub Electronics! We're excited to have you as part of our community.</p>

			${data.verificationLink ? `
				<p><strong>Please verify your email address to get started:</strong></p>
				<a href="${data.verificationLink}" class="button">Verify Email Address</a>
			` : ''}

			<div class="benefits">
				<h3>Your Member Benefits:</h3>
				<ul>
					<li>✓ Exclusive member-only deals and discounts</li>
					<li>✓ Free shipping on orders over UGX 50,000</li>
					<li>✓ Early access to new products and sales</li>
					<li>✓ Easy order tracking and management</li>
					<li>✓ Save your favorite items and addresses</li>
				</ul>
			</div>

			<a href="${process.env.NEXT_PUBLIC_STOREFRONT_URL}/products" class="button">
				Start Shopping
			</a>
		</div>
		<div class="footer">
			<p>TechHub Electronics | Uganda's Premier Electronics Store</p>
			<p>Questions? Contact us at support@techhub.ug</p>
		</div>
	</div>
</body>
</html>
	`;

	return sendEmail({
		to: data.customerEmail,
		subject: "Welcome to TechHub Electronics!",
		html,
	});
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(data: PasswordResetData): Promise<boolean> {
	const html = `
<!DOCTYPE html>
<html>
<head>
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background: linear-gradient(to right, #FB7701, #FD8E1F); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
		.content { background: #fff; padding: 30px; border: 1px solid #ddd; }
		.button { display: inline-block; background: #FB7701; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
		.warning { background: #fff3cd; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0; }
		.footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>🔒 Password Reset Request</h1>
		</div>
		<div class="content">
			<h2>Hello ${data.customerName},</h2>
			<p>We received a request to reset your password. Click the button below to create a new password:</p>

			<a href="${data.resetLink}" class="button">
				Reset Password
			</a>

			<div class="warning">
				<strong>⚠️ Security Notice:</strong>
				<ul>
					<li>This link expires in 1 hour</li>
					<li>If you didn't request this, ignore this email</li>
					<li>Never share this link with anyone</li>
				</ul>
			</div>
		</div>
		<div class="footer">
			<p>TechHub Electronics | Uganda's Premier Electronics Store</p>
			<p>Questions? Contact us at support@techhub.ug</p>
		</div>
	</div>
</body>
</html>
	`;

	return sendEmail({
		to: data.customerEmail,
		subject: "Password Reset Request - TechHub Electronics",
		html,
	});
}

/**
 * Send wishlist back-in-stock notification
 */
export async function sendBackInStockEmail(
	customerEmail: string,
	customerName: string,
	productName: string,
	productSlug: string
): Promise<boolean> {
	const html = `
<!DOCTYPE html>
<html>
<head>
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background: linear-gradient(to right, #FB7701, #FD8E1F); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
		.content { background: #fff; padding: 30px; border: 1px solid #ddd; }
		.button { display: inline-block; background: #FB7701; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
		.highlight { background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
		.footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>🎉 Good News!</h1>
		</div>
		<div class="content">
			<h2>Hello ${customerName},</h2>
			<p>Great news! An item from your wishlist is back in stock:</p>

			<div class="highlight">
				<h3>${productName}</h3>
				<p>✓ Now Available</p>
			</div>

			<p>Hurry! Limited stock available. Get yours before it sells out again.</p>

			<a href="${process.env.NEXT_PUBLIC_STOREFRONT_URL}/products/${productSlug}" class="button">
				Shop Now
			</a>
		</div>
		<div class="footer">
			<p>TechHub Electronics | Uganda's Premier Electronics Store</p>
		</div>
	</div>
</body>
</html>
	`;

	return sendEmail({
		to: customerEmail,
		subject: `${productName} is Back in Stock!`,
		html,
	});
}
