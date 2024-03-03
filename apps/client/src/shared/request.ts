import ky from "ky";

export const request = ky.create({
  prefixUrl: "http://localhost:3000/api/v1",
  credentials: "include",
  retry: 0,
  hooks: {
    beforeError: [
      async (error) => {
        const { response } = error;
        if (response && response.body) {
          error.message = response.status.toString();
        }

        return error;
      },
    ],
  },
});
