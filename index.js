const express = require("express")
const cors = require("cors")
const barangRoutes = require('./src/routes/barangRoutes');

const app = express()


app.use(cors())
app.use(express.json())

app.use("/api", barangRoutes)


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})