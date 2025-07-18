export interface RemarkData {
	name: string;
	email: string;
	content: string;
}

export interface RemarkResponse {
	message: string;
	status: string;
	error: string | null;
	data: any;
}

export async function createRemark(data: RemarkData): Promise<RemarkResponse> {
	try {
		const response = await fetch('/api/remark', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.message || 'Failed to create remark');
		}

		return result;
	} catch (error) {
		console.error('Error creating remark:', error);
		throw error;
	}
} 