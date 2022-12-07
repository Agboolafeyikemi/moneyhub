/**
 * Returns the account from the API
 * @returns account data as an object
 */
export const getAccount = () => {
  return fetch("http://localhost:5000/api/account")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
};
