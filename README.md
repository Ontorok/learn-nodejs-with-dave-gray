### Notes

<ul>
    <li>There are two types of middleware. Built-in or custom.</li>
    <li>Middlewars receives there parameter, (req,res,next). next() call to next middleware </li>
    <li>If we use four parameter (err, req, res, next), express declare it as an error hander</li>
    <li>By default express handle all erros. If we have to hande err with ourself, have to use curstom error handler at the bottom of all routes</li>
    <li>
        routes are act like water fall. It go through first written route to last written route. First mached route will response to the request
    </li>
</ul>
