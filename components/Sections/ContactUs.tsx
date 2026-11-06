import { ArrowRight, MapPin, Loader2, Check } from "lucide-react";
import Section from "./Section";
import React, { useState } from "react";
import { ContactUs as ContactUsType } from "@/app/types/landing";
import { createRemark, RemarkData } from "@/app/actions/contact.actions";
import { useToast } from "@/hooks/use-toast";
import Reveal from "./Reveal";
import { contactRows } from "@/lib/contact";
import type { ModuleContent } from "@/app/types/modules";

interface ContactUsProps {
	contactUs: ContactUsType[];
	/** Heading text; the details are the shared contact list */
	content: ModuleContent["contact"];
}

export default function ContactUs({ contactUs, content }: ContactUsProps) {
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

	const inputClass = (hasError: boolean) =>
		`w-full rounded-sm border bg-white px-4 py-3.5 shadow-sm text-brand-navy placeholder:text-[#9aa3b5] transition-all focus:outline-none focus:ring-4 ${
			hasError
				? "border-red-300 focus:border-red-400 focus:ring-red-100"
				: "border-[#e3e8ef] focus:border-brand-green focus:ring-brand-tint"
		}`;

	const rows = contactRows(contactUs);
	const officeRow = rows.find((row) => row.isOffice);
	const directRows = rows.filter((row) => !row.isOffice);

	const renderLines = (lines: { text: string; href?: string }[], external: boolean) =>
		lines.map((line) =>
			line.href ? (
				<a
					key={line.text}
					href={line.href}
					target={external ? "_blank" : undefined}
					rel={external ? "noopener noreferrer" : undefined}
					className="block break-words text-brand-navy underline-offset-4 transition-colors hover:text-brand-green hover:underline"
				>
					{line.text}
				</a>
			) : (
				<p key={line.text} className="break-words text-brand-navy">
					{line.text}
				</p>
			)
		);

	const labelClass = "mb-2 block text-sm font-medium text-brand-navy";

	return (
		<Section>
			<Reveal className="mx-auto max-w-3xl text-center">
				{content.label && <p className="text-sm font-medium text-brand-green">{content.label}</p>}
				<h2 className="mx-auto mt-3 max-w-[16rem] text-balance text-3xl min-[400px]:max-w-[18rem] sm:max-w-none font-semibold tracking-tight text-brand-navy sm:text-5xl">
					{content.title}
				</h2>
				{content.description && (
					<p className="mx-auto mt-4 max-w-[19rem] text-pretty text-base leading-relaxed text-[#606b80] min-[400px]:max-w-[21rem] sm:max-w-2xl sm:text-lg">
						{content.description}
					</p>
				)}
			</Reveal>

			<div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
				{/* Message form */}
				<Reveal className="rounded-sm bg-[#f5f7fa]/90 p-6 ring-1 ring-black/5 backdrop-blur-xl sm:p-8">
					<h3 className="text-2xl font-semibold tracking-tight text-brand-navy">{content.formTitle}</h3>

					<form onSubmit={handleSubmit} className="mt-6 space-y-5">
						<div>
							<label htmlFor="name" className={labelClass}>
								Name
							</label>
							<input
								type="text"
								id="name"
								value={formData.name}
								onChange={(e) => handleInputChange("name", e.target.value)}
								placeholder="Enter your full name"
								className={inputClass(!!errors.name)}
							/>
							{errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>}
						</div>

						<div>
							<label htmlFor="email" className={labelClass}>
								Email
							</label>
							<input
								type="email"
								id="email"
								value={formData.email}
								onChange={(e) => handleInputChange("email", e.target.value)}
								placeholder="your.email@example.com"
								className={inputClass(!!errors.email)}
							/>
							{errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>}
						</div>

						<div>
							<label htmlFor="content" className={labelClass}>
								Message
							</label>
							<textarea
								id="content"
								value={formData.content}
								onChange={(e) => handleInputChange("content", e.target.value)}
								placeholder="Tell us about your legal needs..."
								rows={5}
								className={`${inputClass(!!errors.content)} resize-none`}
							></textarea>
							{errors.content && <p className="mt-1.5 text-sm text-red-500">{errors.content}</p>}
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brand-navy px-8 py-3.5 font-medium text-white transition-colors hover:bg-brand-green disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="h-5 w-5 animate-spin" />
									Sending Message...
								</>
							) : (
								"Send Message"
							)}
						</button>
					</form>
				</Reveal>

				{/* Direct contact details and map */}
				<Reveal delay={0.1} className="flex flex-col">
					<h3 className="text-2xl font-semibold tracking-tight text-brand-navy">Prefer to reach us directly?</h3>
					<ul className="mt-5 space-y-4">
						{directRows.map(({ id, medium, Icon, lines, external }) => (
							<li key={id} className="flex items-start gap-3">
								<Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" strokeWidth={1.75} />
								<div className="min-w-0">
									<span className="sr-only">{medium}: </span>
									{renderLines(lines, external)}
								</div>
							</li>
						))}
					</ul>

					<div className="relative mt-8 min-h-[440px] flex-1 overflow-hidden rounded-sm ring-1 ring-black/5">
						<iframe
							title="tga location"
							src="https://www.google.com/maps/embed/v1/place?q=dembel%20city%20center&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
							className="absolute inset-x-0 bottom-0 h-[calc(100%+220px)] w-full grayscale-[60%]"
							style={{ border: 0 }}
							allowFullScreen
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
						></iframe>

						{/* Office card over the map; the map is taller than its frame so the pin stays above this card */}
						<div className="absolute inset-x-3 bottom-3 rounded-sm bg-white/95 p-5 shadow-lg ring-1 ring-black/5 backdrop-blur sm:inset-x-5 sm:bottom-5 sm:p-6">
							<h4 className="text-xl font-semibold tracking-tight text-brand-navy">Visit our office</h4>
							<div className="mt-3 flex items-start gap-3 text-sm">
								<MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" strokeWidth={1.75} />
								<div className="min-w-0">
									<p className="text-[#606b80]">{officeRow?.medium ?? "Addis Ababa"}</p>
									{officeRow && renderLines(officeRow.lines, false)}
								</div>
							</div>
							<a
								href="https://www.google.com/maps/search/?api=1&query=dembel%20city%20center"
								target="_blank"
								rel="noopener noreferrer"
								className="group mt-4 inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm font-medium text-brand-navy ring-1 ring-black/10 transition-colors hover:bg-brand-tint"
							>
								Get directions
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
							</a>
						</div>
					</div>
				</Reveal>
			</div>
		</Section>
	);
}
