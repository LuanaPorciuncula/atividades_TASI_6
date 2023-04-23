// Tempo 40m08s

import { interval, from } from 'rxjs';
import fetch from "node-fetch";

const TenSecInterval = interval(1000 * 10);
var products = [];

TenSecInterval.subscribe(i => {
    var productId = Math.floor(Math.random() * 100) + 1;
    var productUrl = "https://dummyjson.com/products/" + productId;
    from(
        fetch(productUrl).then(response => response.json())
    ).subscribe(product => {
        products.push(product.price);
        console.log(product);
        console.log("Média de preço dos últimos 3 produtos:" + meanThreeLastPrices(i));
    })
});

function meanThreeLastPrices(currProdId) {
    var sum = 0;
    var count = 0;
    for (var j = 0; (j < 3 && (currProdId - j) >= 0); j++) {
        sum += products[currProdId - j];
        count++;
    }
    return sum / count;
}
