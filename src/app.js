/*
 * routes
 */
import React from "react"
import { Route } from "react-router"
import App from "./components/App"
import Root from "./components/Root"
import Issues from "./components/Issues"
import Issue from "./components/Issue"

export const routes = (
    <Route component={App}>
        <Route path="/" component={Root} />
        <Route path="/issues" component={Issues} />
        <Route path="/issues/:number" component={Issue} />
    </Route>
)



/*
 * actions
 */
import axios from "axios"

const BASE_URL = "https://api.github.com"

export function queryIssues() {
    return dispatch =>
        axios.get(`${BASE_URL}/repos/facebook/react/issues`)
        .then(res => dispatch({
            type: "QUERY_ISSUES_SUCCESS",
            payload: { issues: res.data }
        }))
}

export function getIssue(number) {
    return dispatch =>
        axios.get(`${BASE_URL}/repos/facebook/react/issues/${number}`)
        .then(res => dispatch({
            type: "GET_ISSUE_SUCCESS",
            payload: { issue: res.data }
        }))
}



/*
 * reducers
 */
import { combineReducers } from "redux"
import { routerReducer as routing } from "react-router-redux"

function issues(state = { issues: [] }, { type, payload }) {
    return type === "QUERY_ISSUES_SUCCESS" ? { issues: [...payload.issues] } : state
}

function issue(state = { issue: { user: {} } }, { type, payload }) {
    return type === "GET_ISSUE_SUCCESS" ? { issue: {...payload.issue} } : state
}

const rootReducer = combineReducers({
    routing,
    issues,
    issue
})



/*
 * store
 */
import { createStore, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"

export function configureStore(initialState = {}) {
    return createStore(rootReducer,
        initialState, applyMiddleware(thunkMiddleware))
}
