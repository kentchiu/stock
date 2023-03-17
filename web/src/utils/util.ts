export const decimalFormat = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const mockAsyncCall = async (milisec: number, returnValue?: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (returnValue) {
        resolve(returnValue);
      } else {
        resolve("");
      }
    }, milisec);
  });
};

export function wrapPromise(promise: Promise<any>) {
  let status = "pending";
  let response: any;

  const suspender = promise.then(
    (res) => {
      status = "success";
      response = res;
    },
    (err) => {
      status = "error";
      response = err;
    }
  );

  const read = () => {
    switch (status) {
      case "pending":
        throw suspender;
      case "error":
        throw response;
      default:
        return response;
    }
  };

  return { read };
}
