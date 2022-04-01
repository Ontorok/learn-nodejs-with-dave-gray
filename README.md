### Notes

<ul>
    <li>  use verifyJWT( ) middlware either  specif route(s) or all routes. </li>
    <li> 
        <pre>router.get("/", verifyJWT, getAllEmployees);</pre>
        In this case verifyJWT works only this request
     </li>
     <li> 
        <pre>
        app.use(verifyJWT);
        app.use("/employees", employeesRoute);</pre>
        In this case verifyJWT works with all request with this route
     </li>
</ul>
