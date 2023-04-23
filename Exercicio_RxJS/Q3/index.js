// Tempo 10m59s

import { interval, from} from 'rxjs';
import fetch from "node-fetch";

const TenSecInterval = interval(1000 * 10);

TenSecInterval.subscribe(i => {
    var productId =  Math.floor(Math.random() * 100) + 1;
    var productUrl = "https://dummyjson.com/products/" + productId;
    from(
        fetch(productUrl).then(response => response.json())
    ).subscribe(product => console.log(product))
});
