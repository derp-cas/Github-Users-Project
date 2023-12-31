import React, { useState, useEffect, useContext } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'

const GithubContext = React.createContext()

const GithubProvider = ({ children }) => {
    const [githubUser, setGithubUser] = useState(mockUser)
    const [repos, setRepos] = useState(mockRepos)
    const [followers, setFollowers] = useState(mockFollowers)

    // request loading
    const [requests, setRequests] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState({ show: false, msg: '' })

    const searchGithubUser = async (user) => {
        //toggle error to default (false and no msg)
        toggleError()
        setIsLoading(true)
        const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
            console.log(err)
        )

        if (response) {
            setGithubUser(response.data)
            const { login, followers_url } = response.data

            await Promise.allSettled([
                axios(`${rootUrl}/users/${login}/repos?per_page=100`),
                axios(`${followers_url}?per_page=100`),
            ])
                .then((results) => {
                    const [repos, followers] = results
                    const status = 'fulfilled'
                    if (repos.status === status) {
                        setRepos(repos.value.data)
                    }
                    if (followers.status === status) {
                        setFollowers(followers.value.data)
                    }
                })
                .catch((err) => console.log(err))
            //repos
            //https://api.github.com/users/john-smilga/repos?per_page=100
            //followers
            //https://api.github.com/users/john-smilga/followers
        } else {
            toggleError(true, 'there is no user with that username')
        }
        checkRequest()
        setIsLoading(false)
    }

    //check request rate
    const checkRequest = () => {
        axios(`${rootUrl}/rate_limit`)
            .then(({ data }) => {
                let {
                    rate: { remaining },
                } = data
                setRequests(remaining)
                if (remaining === 0) {
                    toggleError(
                        true,
                        'sorry,you have exeeded your hourly request limit :('
                    )
                }
            })
            .catch((err) => console.log(err))
    }
    function toggleError(show = false, msg = '') {
        setError({ show, msg })
    }
    //error

    useEffect(checkRequest, [])

    return (
        <GithubContext.Provider
            value={{
                githubUser,
                repos,
                followers,
                requests,
                error,
                searchGithubUser,
                isLoading,
            }}
        >
            {children}
        </GithubContext.Provider>
    )
}
// setting global context
export const useGobalContext = () => {
    return useContext(GithubContext)
}

export { GithubProvider, GithubContext }
