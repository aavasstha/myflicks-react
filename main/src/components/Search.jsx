import React from 'react'


const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className='search mr-[40px]' >
            <img src="/search.svg" />
            <input type='text' placeholder='Search movies by title' onChange={e => setSearchTerm(e.target.value)} />
        </div>
    )
}

export default Search