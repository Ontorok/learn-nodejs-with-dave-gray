### Notes

<ul>
    <li>res.sendFile() method use for send file to the response. There are two different ways to use sendFile()
    <ol>
        <li>sendFile(path: string, fn?: Errback): void;<li>
        <li> sendFile(path: string, options: any, fn?: Errback): void;<li>
    <ol>
    </li>
    <li>
        routes are act like water fall. It go through first written route to last written route. First mached route will response to the request
    </li>
</ul>
