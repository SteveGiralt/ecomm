const layout = require("../layout");
module.exports = ({ products }) => {
  const renderedProducts = products
    .map((product) => {
      const formattedPrice = product.price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      return `
        <li>${product.title} - ${formattedPrice}
        `;
    })
    .join("");

  return layout({
    content: `
        <h1 class="title">Products</h1>
        <div>
            <ul>
                ${renderedProducts}
            </ul>
        </div>
        `,
  });
};
