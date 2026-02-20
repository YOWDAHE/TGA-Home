import { Home, Mail, MessageCircle, Phone, Loader2, Check } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { ContactUs as ContactUsType } from "@/app/types/landing";
import { createRemark, RemarkData } from "@/app/actions/contact.actions";
import { useToast } from "@/hooks/use-toast";

interface ContactUsProps {
	contactUs: ContactUsType[];
}

export default function ContactUs({ contactUs }: ContactUsProps) {
	const [formData, setFormData] = useState<RemarkData>({
		name: "",
		email: "",
		content: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<Partial<RemarkData>>({});
	const { toast } = useToast();

	const validateForm = (): boolean => {
		const newErrors: Partial<RemarkData> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		if (!formData.content.trim()) {
			newErrors.content = "Message is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field: keyof RemarkData, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: undefined }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		try {
			setIsSubmitting(true);

			const response = await createRemark(formData);

			if (response.status === "success") {
				toast({
					title: "Message sent successfully!",
					description: "We'll get back to you as soon as possible.",
					action: (
						<div className="flex items-center space-x-2">
							<Check className="w-4 h-4 text-green-500" />
							<span className="text-sm text-green-600">Sent</span>
						</div>
					),
				});

				// Reset form
				setFormData({ name: "", email: "", content: "" });
				setErrors({});
			}
		} catch (error) {
			console.error("Error sending message:", error);
			toast({
				title: "Failed to send message",
				description: error instanceof Error ? error.message : "Please try again later.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section
			id="contact"
			className="py-20 bg-gradient-to-br from-gray-100 via-gray-50 to-white relative overflow-hidden"
		>
			<div className="absolute inset-0 bg-[url('/office/placeholder.jpg?height=50&width=50')] opacity-5"></div>
			<div className="container mx-auto px-4 relative z-10">
				<div className="text-center mb-16">
					<h2 className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
						CONTACT US
					</h2>
					<div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full"></div>
					<p className="text-gray-600 mt-4 text-lg">
						Get in touch for premium legal services
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
					<div className="bg-white md:p-10 p-6 rounded-3xl shadow-2xl border border-gray-100">
						<h3 className="text-2xl font-bold text-gray-900 mb-6">
							Send us a message
						</h3>
						<p className="text-gray-600 mb-8 leading-relaxed">
							Get in touch with us for premium business service, we will promptly
							respond to all your enquiries.
						</p>

						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-semibold text-gray-700 mb-2"
								>
									Name
								</label>
								<input
									type="text"
									id="name"
									value={formData.name}
									onChange={(e) => handleInputChange("name", e.target.value)}
									placeholder="Enter your full name"
									className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 ${errors.name ? "border-red-300 focus:ring-red-500" : "border-gray-200"
										}`}
								/>
								{errors.name && (
									<p className="text-red-500 text-sm mt-1">{errors.name}</p>
								)}
							</div>

							<div>
								<label
									htmlFor="email"
									className="block text-sm font-semibold text-gray-700 mb-2"
								>
									Email
								</label>
								<input
									type="email"
									id="email"
									value={formData.email}
									onChange={(e) => handleInputChange("email", e.target.value)}
									placeholder="your.email@example.com"
									className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 ${errors.email
											? "border-red-300 focus:ring-red-500"
											: "border-gray-200"
										}`}
								/>
								{errors.email && (
									<p className="text-red-500 text-sm mt-1">{errors.email}</p>
								)}
							</div>

							<div>
								<label
									htmlFor="content"
									className="block text-sm font-semibold text-gray-700 mb-2"
								>
									Message
								</label>
								<textarea
									id="content"
									value={formData.content}
									onChange={(e) => handleInputChange("content", e.target.value)}
									placeholder="Tell us about your legal needs..."
									rows={5}
									className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 resize-none ${errors.content
											? "border-red-300 focus:ring-red-500"
											: "border-gray-200"
										}`}
								></textarea>
								{errors.content && (
									<p className="text-red-500 text-sm mt-1">{errors.content}</p>
								)}
							</div>

							<Button
								type="submit"
								disabled={isSubmitting}
								className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="w-5 h-5 mr-2 animate-spin" />
										Sending Message...
									</>
								) : (
									"Send Message"
								)}
							</Button>
						</form>
					</div>

					<div className="flex flex-col gap-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{contactUs.map((contact, index) => {
								let icon = null;
								let color = "from-blue-500 to-blue-600";
								if (contact.medium.toLowerCase().includes("phone")) {
									icon = <Phone className="w-6 h-6 text-white" />;
									color = "from-blue-500 to-blue-600";
								} else if (contact.medium.toLowerCase().includes("email")) {
									icon = <Mail className="w-6 h-6 text-white" />;
									color = "from-green-500 to-green-600";
								} else if (contact.medium.toLowerCase().includes("whatsapp")) {
									icon = <MessageCircle className="w-6 h-6 text-white" />;
									color = "from-emerald-500 to-emerald-600";
								} else if (contact.medium.toLowerCase().includes("office")) {
									icon = <Home className="w-6 h-6 text-white" />;
									color = "from-purple-500 to-purple-600";
								}
								return (
									<div
										key={contact.id}
										className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
									>
										<div
											className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mb-4`}
										>
											{icon}
										</div>
										<h3 className="text-gray-500 font-semibold mb-2">
											{contact.medium}
										</h3>
										<p className="text-gray-900 font-bold">
											{contact.email || contact.phone_number || "-"}
										</p>
									</div>
								);
							})}
						</div>

						<div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex-1">
							<div className="h-full">
								<iframe
									title="tga location"
									src="https://www.google.com/maps/embed/v1/place?q=dembel%20city%20center&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
									width="100%"
									height="100%"
									style={{ border: 0 }}
									allowFullScreen
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
									className="rounded-3xl"
								></iframe>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
