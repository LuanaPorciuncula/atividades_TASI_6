// Tempo 3h50m
import { from, interval, take, map, mergeMap, retry, tap, of , throwError} from 'rxjs';
import fetch from "node-fetch";

const milisseconds = interval(1000 * 3);

const statusCodesReq = milisseconds.pipe(
    take(10),
    map(n => n + 401),
    map(statusCode => {
        var statusCodeUrl = 'https://httpbin.org/status/' + statusCode;

        from( fetch(statusCodeUrl).then(response => response.json()).catch((err, caught) => caught))
            .pipe(
                mergeMap(response => response === undefined ? throwError(() => "Ocorreu um erro ao requisitar o URL "+ statusCodeUrl) : of(response)),
                retry(3)
            )
            .subscribe({
                next: x => console.log(x),
                error: err => console.log(err + " (número de tentativas: 3)")});
        return statusCode;
    })
);

statusCodesReq.subscribe(statusCode => console.log("Request on https://httpbin.org/status/" + statusCode));