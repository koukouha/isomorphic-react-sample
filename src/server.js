import express from "express"

const app = express()

import React from "react"
import { renderToString } from "react-dom/server"
import { Provider } from "react-redux"
import { match, Router, RouterContext } from "react-router"

import {
    configureStore,
    routes
} from "./app"

const store = configureStore()

function renderFullPage(markup, initialState = {}) {
    return `
    <!doctype html>
    <html>
        <head>
            <meta charset="utf-8" />
            <title>isomorphic react sample</title>
        </head>
        <body>
            <div id="root"></div>
            <script src="/bundle.js"></script>
            <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}</script>
        </body>
    </html>
    `
}

app.use(express.static(`${__dirname}/../build`))
app.use((req, res) => {
    match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {

        // TODO:
        if (renderProps) {
            const initialState = store.getState()
            const markup = renderToString(
                <Provider store={store}>
                    <RouterContext {...renderProps} />
                </Provider>
            )
            res.status(200).send(renderFullPage(markup, initialState))
        }
    })
})

const PORT = 2222

app.listen(PORT, () => {
    console.log(`App serving at http://127.0.0.1:${PORT}`)
})
