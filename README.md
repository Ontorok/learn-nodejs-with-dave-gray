### Notes

<pre>
mongoose.connection.once("open", () => {
  console.log("connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
});
</pre>

<p>User this way to connect MongoDB to avoid one of twos connection failure</p>
