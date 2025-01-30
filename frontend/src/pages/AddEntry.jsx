import React, {useContext, useState} from "react";
import { EntryContext } from '../context/EntryContext';

export default function AddEntry() {

    const {tags, addEntry} = useContext(EntryContext)
    console.log("Tags", tags);

    const [title, setTitle] = useState('');
    const [tag_id, setTagId] = useState("");
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        addEntry(title, content, parseInt(tag_id));

        setTitle("")
        setContent("")
        setTagId("")
    }

    return (
        <div className="entry-add">
            <h3>A penny for your thoughts...</h3>

            <form onSubmit={handleSubmit}>
                <input id="title" type="text" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

                <select onChange={(e) => setTagId(e.target.value)}  >
                    <option value="">Choose</option>

                    {tags && tags.map((tag)=>(

                    <option value={tag.id} key={tag.id}>{tag.name}</option>

                    ))}
                </select>     

                <textarea id="content" type="text" placeholder="Air out your feelings..." value={content} onChange={(e) => setContent(e.target.value)} required></textarea>

                <div className="entry-btn">
                    <button type="submit">Let it out</button>
                </div>
                       
            </form>        
        </div>
    )
}