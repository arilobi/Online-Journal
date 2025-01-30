import React, { useContext } from "react";
import { EntryContext } from "../context/EntryContext"
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

export default function Home() {

    const {entries, deleteEntry} = useContext(EntryContext)
    const {current_user} = useContext(UserContext)

    console.log(entries)

    return (
        <div className="entry-home">
  <h1>What happened today...</h1>
  {/* <h1>My entries - {entries && entries.length}</h1> */}

  {
    current_user ?
      <div>
        {
          entries && entries.length < 1 &&
          <div className="no-entries">
            You don't have Entries. 
            <Link to="/addentry" className="create-entry-link"> Create</Link>
          </div>
        }

        <div className="home">
          {entries && entries.map && entries.map((entry) => (
            <div key={entry.id} className="entry-card">                       
              <Link to={`/entry/${entry.id}`} className="entry-title">{entry.title}</Link>  {/* Link first */}

              <div className="functions">
                <p className="date-created">Entry created: {entry.date_created}</p>
                <p className="date-updated">Entry updated: {entry.date_updated}</p>
                <span onClick={() => deleteEntry(entry.id)} className="delete-btn">Delete</span>   
              </div>   

              <div className="home-2">
                <p className="entry-tag">{entry.tag.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    :
      <div className='home-login'>
        <div className="home-access">
          <Link to="/login" className="font-medium">Login</Link> to access this page.
        </div>
      </div>
  }
</div>
    )
}