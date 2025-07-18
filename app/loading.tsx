import Loader from "@/components/loader";

export default function Loading() {
	return (
		<div className="flex items-center justify-center h-screen">
			<Loader size={200} />
		</div>
	);
}
