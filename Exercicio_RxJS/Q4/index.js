// Tempo 23m09s

import { interval, from, take, tap} from 'rxjs';
import fetch from "node-fetch";

const timeout = 15;
const reqinterval = 10;
const TenSecInterval = interval(1000 * reqinterval);

const tenSecIntervalWithTimeout = TenSecInterval.pipe(
    // Calcula quantos intervalos de 10s estão em 15s
    take(Math.ceil((timeout+1)/reqinterval))
    )

tenSecIntervalWithTimeout.subscribe(i => {
    var productId =  Math.floor(Math.random() * 100) + 1;
    var productUrl = "https://dummyjson.com/products/" + productId;
    from(
        fetch(productUrl).then(response => response.json())
    ).subscribe(product => console.log(product))
});