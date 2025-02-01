import React, {useEffect, useReducer} from "react";
import axios from "axios";
import {AppDispatch} from "../../utils/store.ts";
import {useDispatch} from "react-redux";
import {setAppError, setAppLoading} from "../../slices/appSlice.ts";

export interface Note {
    id: number;
    title: string;
    description: string;
}

interface State {
    notes: Note[];
    dialog: "create" | "edit" | "delete" | null;
    currentNote: Note;
}

type Action =
    | { type: "SET_NOTES", payload: Note[] }
    | { type: "OPEN_DIALOG", payload: { dialog: "create" | "edit" | "delete", note?: Note } }
    | { type: "CLOSE_DIALOG" }
    | { type: "UPDATE_CURRENT_NOTE"; payload: Partial<Note> }
    | { type: "ADD_NOTE"; payload: Note }
    | { type: "EDIT_NOTE"; payload: Note }
    | { type: "DELETE_NOTE"; payload: Note };

const initialState: State = {
    notes: [],
    dialog: null,
    currentNote: {id: 0, title: "", description: ""},
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_NOTES":
            return {
                ...state,
                notes: action.payload
            };
        case "OPEN_DIALOG":
            return {
                ...state,
                dialog: action.payload.dialog,
                currentNote: action.payload.note || {id: 0, title: "", description: ""}
            };
        case "CLOSE_DIALOG":
            return {
                ...state,
                dialog: null,
                currentNote: {id: 0, title: "", description: ""}
            };
        case "UPDATE_CURRENT_NOTE":
            return {
                ...state,
                currentNote: {...state.currentNote, ...action.payload}
            };
        case "ADD_NOTE":
            return {
                ...state,
                notes: [...state.notes, action.payload],
                dialog: null
            };
        case "EDIT_NOTE":
            return {
                ...state,
                notes: state.notes.map(note => (note.id === action.payload.id ? action.payload : note)),
                dialog: null,
            };
        case "DELETE_NOTE":
            return {
                ...state,
                notes: state.notes.filter(note => note.id !== action.payload.id),
                dialog: null,
            };
        default:
            return state;
    }
};

const PageNotes: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [state, localDispatch] = useReducer(reducer, initialState);

    const getNotes = async () => {
        dispatch(setAppLoading(true));
        try {
            const notesResponse = await axios.get(import.meta.env.VITE_BASE_URL + "/notes", {
                params: {owner: 'me'},
            });
            localDispatch({type: "SET_NOTES", payload: notesResponse.data});
        } catch (error) {
            dispatch(setAppError(error as any));
        } finally {
            dispatch(setAppLoading(false));
        }
    };

    useEffect(() => {
        getNotes().then();
    }, []);

    const openDialog = (dialog: "create" | "edit" | "delete", note?: Note) => {
        localDispatch({type: "OPEN_DIALOG", payload: {dialog, note}});
    };

    const closeDialog = () => {
        localDispatch({type: "CLOSE_DIALOG"});
    };

    const createNote = async () => {
        dispatch(setAppLoading(true));
        try {
            const response = await axios.post(import.meta.env.VITE_BASE_URL + "/notes", {
                title: state.currentNote.title,
                description: state.currentNote.description,
            });
            localDispatch({ type: "ADD_NOTE", payload: response.data });
        } catch (error) {
            dispatch(setAppError(error as any));
        } finally {
            dispatch(setAppLoading(false));
        }
    };

    const editNote = async () => {
        dispatch(setAppLoading(true));
        try {
            const response = await axios.put(import.meta.env.VITE_BASE_URL + `/notes/${state.currentNote.id}`, {
                title: state.currentNote.title,
                description: state.currentNote.description,
            });
            localDispatch({ type: "EDIT_NOTE", payload: response.data });
        } catch (error) {
            dispatch(setAppError(error as any));
        } finally {
            dispatch(setAppLoading(false));
        }
    };

    const deleteNote = async () => {
        dispatch(setAppLoading(true));
        try {
            await axios.delete(import.meta.env.VITE_BASE_URL + `/notes/${state.currentNote.id}`);
            localDispatch({ type: "DELETE_NOTE", payload: state.currentNote });
        } catch (error) {
            dispatch(setAppError(error as any));
        } finally {
            dispatch(setAppLoading(false));
        }
    };

    return (
        <>
            <div className="p-4 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-20">
                <div
                    className="border border-gray-300 shadow-md rounded-lg p-4 bg-white hover:shadow-lg transition-shadow duration-200"
                >
                    <h3 className="text-lg font-semibold items-center h-full flex justify-center"
                        onClick={() => openDialog("create")}
                    >Create new</h3>
                </div>
                {state.notes.length > 0 &&
                    state.notes.map((note) => (
                        <div
                            key={note.id}
                            className="border border-gray-300 shadow-md rounded-lg p-4 bg-white hover:shadow-lg transition-shadow duration-200"
                        >
                            <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
                            <p className="text-gray-600 mb-4 whitespace-pre-wrap">{note.description}</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => openDialog("edit", note)}
                                    className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => openDialog("delete", note)}
                                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>

            {state.dialog === "create" && (
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
                                value={state.currentNote.title}
                                onChange={(e) => localDispatch({
                                    type: "UPDATE_CURRENT_NOTE",
                                    payload: {title: e.target.value}
                                })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                placeholder="Description"
                                value={state.currentNote.description}
                                onChange={(e) => localDispatch({
                                    type: "UPDATE_CURRENT_NOTE",
                                    payload: {description: e.target.value}
                                })}
                                rows={4}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={closeDialog}
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createNote}
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {state.dialog === "edit" && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Note</h2>
                        <p className="text-gray-600 mb-6">
                            Fill in the details to edit the note.
                        </p>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={state.currentNote.title}
                                onChange={(e) => localDispatch({
                                    type: "UPDATE_CURRENT_NOTE",
                                    payload: {title: e.target.value}
                                })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                placeholder="Description"
                                value={state.currentNote.description}
                                onChange={(e) => localDispatch({
                                    type: "UPDATE_CURRENT_NOTE",
                                    payload: {description: e.target.value}
                                })}
                                rows={4}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={closeDialog}
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editNote}
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {state.dialog === "delete" && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Note</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this note?: {state.currentNote.title}
                        </p>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={closeDialog}
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteNote}
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
