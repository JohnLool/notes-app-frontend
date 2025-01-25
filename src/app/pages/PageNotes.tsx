import React, {useEffect, useState} from "react";
import axios from "axios";
import {AppDispatch} from "../../utils/store.ts";
import {useDispatch} from "react-redux";
import {setAppError, setAppLoading} from "../../slices/appSlice.ts";

export interface Note {
    id: number;
    title: string;
    description: string;
}

const PageNotes: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();

    const [notes, setNotes] = useState<Note[]>([]);

    const [createNoteDialogIsOpen, setCreateNoteDialogIsOpen] = useState<boolean>(false);
    const [editNoteDialogIsOpen, setEditNoteDialogIsOpen] = useState<boolean>(false);
    const [deleteNoteDialogIsOpen, setDeleteNoteDialogIsOpen] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const getNotes = () => {
        dispatch(setAppLoading(true));
        axios.get(import.meta.env.VITE_BASE_URL + "/users/me").then((response) => {
            axios.get(import.meta.env.VITE_BASE_URL + "/notes", {
                params: {owner: response.data.id,},
            }).then((response) => {
                setNotes(response.data);
            }).catch((error) => {
                dispatch(setAppError(error));
            }).finally(() => {
                dispatch(setAppLoading(false));
            });
        }).catch((error) => {
            dispatch(setAppError(error));
            dispatch(setAppLoading(false));
        });
    }

    const createNote = () => {
        dispatch(setAppLoading(true));
        axios.post(import.meta.env.VITE_BASE_URL + '/notes', {
            title,
            description,
        }).then((response) => {
            console.log(response);
            getNotes();
            setCreateNoteDialogIsOpen(false);
            setTitle("");
            setDescription("");
        }).catch((error) => {
            dispatch(setAppError(error));
        }).finally(() => {
            dispatch(setAppLoading(false));
        });
    }

    const editNote = () => {
        dispatch(setAppLoading(true));
        axios.put(import.meta.env.VITE_BASE_URL + '/notes/' + id, {
            title,
            description,
        }).then((response) => {
            console.log(response);
            getNotes();
            setEditNoteDialogIsOpen(false);
            setId(0);
            setTitle("");
            setDescription("");
        }).catch((error) => {
            dispatch(setAppError(error));
        }).finally(() => {
            dispatch(setAppLoading(false));
        });
    }

    const deleteNote = () => {
        dispatch(setAppLoading(true));
        axios.delete(import.meta.env.VITE_BASE_URL + '/notes/' + id).then((response) => {
            console.log(response);
            getNotes();
            setDeleteNoteDialogIsOpen(false);
            setId(0);
            setTitle("");
            setDescription("");
        }).catch((error) => {
            dispatch(setAppError(error));
        }).finally(() => {
            dispatch(setAppLoading(false));
        });
    }

    const openCreateNoteDialog = () => {
        setTitle("");
        setDescription("");
        setCreateNoteDialogIsOpen(true);
    }

    const openEditNoteDialog = (noteId: number) => {
        dispatch(setAppLoading(true));
        axios.get(import.meta.env.VITE_BASE_URL + '/notes/' + noteId, {
        }).then((response) => {
            console.log(response.data);
            setId(response.data.id);
            setTitle(response.data.title);
            setDescription(response.data.description);
            setEditNoteDialogIsOpen(true);
        }).catch((error) => {
            dispatch(setAppError(error));
        }).finally(() => {
            dispatch(setAppLoading(false));
        });
    }

    const openDeleteNoteDialog = (noteId: number) => {
        dispatch(setAppLoading(true));
        axios.get(import.meta.env.VITE_BASE_URL + '/notes/' + noteId, {
        }).then((response) => {
            console.log(response.data);
            setId(response.data.id);
            setTitle(response.data.title);
            setDescription(response.data.description);
            setDeleteNoteDialogIsOpen(true);
        }).catch((error) => {
            dispatch(setAppError(error));
        }).finally(() => {
            dispatch(setAppLoading(false));
        });
    }

    useEffect(() => {
        getNotes();
    }, []);

    return (
        <>
            <div className="p-4 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-20">
                <div
                    className="border border-gray-300 shadow-md rounded-lg p-4 bg-white hover:shadow-lg transition-shadow duration-200"
                >
                    <h3 className="text-lg font-semibold items-center h-full flex justify-center"
                        onClick={() => openCreateNoteDialog()}
                    >Create new</h3>
                </div>
                {notes.length > 0 &&
                    notes.map((note) => (
                        <div
                            key={note.id}
                            className="border border-gray-300 shadow-md rounded-lg p-4 bg-white hover:shadow-lg transition-shadow duration-200"
                        >
                            <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
                            <p className="text-gray-600 mb-4 whitespace-pre-wrap">{note.description}</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => openEditNoteDialog(note.id)}
                                    className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => openDeleteNoteDialog(note.id)}
                                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>

            {createNoteDialogIsOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Note</h2>
                        <p className="text-gray-600 mb-6">
                            Fill in the details to create a new note.
                        </p>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => setCreateNoteDialogIsOpen(false)}
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => createNote()}
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editNoteDialogIsOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Note</h2>
                        <p className="text-gray-600 mb-6">
                            Fill in the details to edit the note.
                        </p>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => setEditNoteDialogIsOpen(false)}
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => editNote()}
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteNoteDialogIsOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Note</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this note?
                        </p>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => setDeleteNoteDialogIsOpen(false)}
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteNote()}
                                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PageNotes;
