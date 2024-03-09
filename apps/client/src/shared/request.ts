import ky from "ky";

export class KyNetworkError {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

export const request = ky.create({
  prefixUrl: "http://localhost:3000/api/v1",
  credentials: "include",
  retry: 0,
  hooks: {
    beforeError: [
      async (error) => {
        const { response } = error;

        let message = "Something goes wrong. Try again later.";

        if (response.ok) {
          const data = await response.json();
          message = data.message as string;
        }

        throw new KyNetworkError(response.status, message);
      },
    ],
  },
});
