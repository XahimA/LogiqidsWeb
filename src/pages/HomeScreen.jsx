import { useState, useEffect, useRef } from "react";
import {
  Trash,
  Plus,
  Edit2,
  Calendar,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { AddCardForm } from "../components/AddCardForm";
import { GlassModal } from "../components/GlassModal";
import { CardModal } from "../components/CardModal";





export default function HomeScreen() {
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem("trello-lists");
    return savedLists
      ? JSON.parse(savedLists)
      : [
          {
            id: "list-1",
            title: "Xahim Tasks",
            cards: [
              {
                id: "card-1",
                title: "Making To Do list",
                description: "Inspired by Trello",
                dueDate: "",
              },
              {
                id: "card-2",
                title: "Code Handover",
                description: "Sharing github Link To Logiqids",
                dueDate: "",
              },
            ],
            color: "bg-blue-100",
          },
        ];
  });

  // State management
  const [toasts, setToasts] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [showAddList, setShowAddList] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [activeList, setActiveList] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [editingListId, setEditingListId] = useState(null);
  const [editingListTitle, setEditingListTitle] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerListId, setColorPickerListId] = useState(null);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  // Trello-inspired color options
  const colorOptions = [
    { name: "Blue", value: "bg-blue-500" },
    { name: "Green", value: "bg-green-500" },
    { name: "Yellow", value: "bg-yellow-500" },
    { name: "Orange", value: "bg-orange-500" },
    { name: "Red", value: "bg-red-500" },
    { name: "Purple", value: "bg-purple-500" },
    { name: "Pink", value: "bg-pink-500" },
    { name: "Indigo", value: "bg-indigo-500" },
    { name: "Teal", value: "bg-teal-500" },
  ];
  

  useEffect(() => {
    localStorage.setItem("trello-lists", JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        removeToast(toasts[0].id);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const dragCard = useRef(null);
  const dragCardNode = useRef(null);
  const dragList = useRef(null);
  const dragListNode = useRef(null);

  const removeToast = (id) => {
    setToasts(toasts.filter((toast) => toast.id !== id));
  };

  const resetBoard = () => {
    setConfirmModal({
      isOpen: true,
      title: "Reset Board",
      message:
        "Are you sure you want to reset the board? All data will be lost.",
      onConfirm: () => {
        localStorage.removeItem("trello-lists");
        setLists([
          {
            id: "list-1",
            title: "Xahim Tasks",
            cards: [
              {
                id: "card-1",
                title: "Making To Do list",
                description: "Inspired by Trello",
                dueDate: "",
              },
              {
                id: "card-2",
                title: "Code Handover",
                description: "Sharing github Link To Logiqids",
                dueDate: "",
              },
            ],
            color: "bg-blue-100",
          },
        ]);
        showToast("Board has been reset", "success");
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const generateId = (prefix) => {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const addList = () => {
    if (newListTitle.trim()) {
      const newList = {
        id: generateId("list"),
        title: newListTitle,
        cards: [],
        color: "bg-blue-100",
      };
      setLists([...lists, newList]);
      showToast(`List "${newListTitle}" added`, "success");
      setNewListTitle("");
      setShowAddList(false);
    }
  };

  const deleteList = (listId) => {
    const listToDelete = lists.find((list) => list.id === listId);

    setConfirmModal({
      isOpen: true,
      title: "Delete List",
      message: `Are you sure you want to delete "${listToDelete.title}" and all its cards?`,
      onConfirm: () => {
        setLists(lists.filter((list) => list.id !== listId));
        showToast(`List "${listToDelete.title}" deleted`, "info");
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const startEditingList = (listId, currentTitle) => {
    setEditingListId(listId);
    setEditingListTitle(currentTitle);
  };

  const saveListTitle = () => {
    if (editingListTitle.trim()) {
      const oldTitle = lists.find((list) => list.id === editingListId)?.title;

      setLists(
        lists.map((list) =>
          list.id === editingListId
            ? { ...list, title: editingListTitle }
            : list
        )
      );

      if (oldTitle !== editingListTitle) {
        showToast(`List renamed to "${editingListTitle}"`, "info");
      }

      setEditingListId(null);
      setEditingListTitle("");
    }
  };

  const changeListColor = (listId, colorValue) => {
    setLists(
      lists.map((list) =>
        list.id === listId ? { ...list, color: colorValue } : list
      )
    );
    setColorPickerListId(null);
    setShowColorPicker(false);

    const listTitle = lists.find((list) => list.id === listId)?.title;
    const colorName = colorOptions.find(
      (color) => color.value === colorValue
    )?.name;
    showToast(`Changed ${listTitle} color to ${colorName}`, "info");
  };

  const addCard = (listId, cardTitle) => {
    if (cardTitle.trim()) {
      const newCard = {
        id: generateId("card"),
        title: cardTitle,
        description: "",
        dueDate: "",
      };

      setLists(
        lists.map((list) =>
          list.id === listId
            ? { ...list, cards: [...list.cards, newCard] }
            : list
        )
      );

      const listTitle = lists.find((list) => list.id === listId)?.title;
      showToast(`Added card "${cardTitle}" to ${listTitle}`, "success");
    }
  };

  const updateCard = (cardData) => {
    const originalCard = lists
      .flatMap((list) => list.cards)
      .find((card) => card.id === cardData.id);

    setLists(
      lists.map((list) => ({
        ...list,
        cards: list.cards.map((card) =>
          card.id === cardData.id ? cardData : card
        ),
      }))
    );

    setShowCardModal(false);
    setEditingCard(null);

    if (originalCard.title !== cardData.title) {
      showToast(`Card updated: "${cardData.title}"`, "info");
    } else if (originalCard.completed !== cardData.completed) {
      showToast(
        cardData.completed
          ? "Card marked as completed"
          : "Card marked as incomplete",
        "info"
      );
    } else {
      showToast("Card updated successfully", "info");
    }
  };

  const deleteCard = (cardId) => {
    const cardToDelete = lists
      .flatMap((list) => list.cards)
      .find((card) => card.id === cardId);

    setConfirmModal({
      isOpen: true,
      title: "Delete Card",
      message: `Are you sure you want to delete "${cardToDelete.title}"?`,
      onConfirm: () => {
        setLists(
          lists.map((list) => ({
            ...list,
            cards: list.cards.filter((card) => card.id !== cardId),
          }))
        );
        setShowCardModal(false);
        setEditingCard(null);
        showToast(`Card "${cardToDelete.title}" deleted`, "info");
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const openCardModal = (card, listId) => {
    const listTitle = lists.find((list) => list.id === listId)?.title || "";
    setEditingCard({ ...card, listId, listTitle });
    setShowCardModal(true);
  };

  const handleDragStart = (e, params) => {
    dragCard.current = params;
    dragCardNode.current = e.target;
    dragCardNode.current.addEventListener("dragend", handleDragEnd);
    setTimeout(() => {
      setActiveCard(params);
    }, 0);
  };

  const handleDragEnd = () => {
    setActiveCard(null);
    dragCard.current = null;
    if (dragCardNode.current) {
      dragCardNode.current.removeEventListener("dragend", handleDragEnd);
      dragCardNode.current = null;
    }
  };

  const handleDragEnter = (e, params) => {
    if (activeCard) {
      const { listId: currentListId, index: currentIndex } = dragCard.current;
      const { listId: targetListId, index: targetIndex } = params;

      if (currentListId !== targetListId || currentIndex !== targetIndex) {
        setLists((prevLists) => {
          const newLists = JSON.parse(JSON.stringify(prevLists));

          const sourceList = newLists.find((list) => list.id === currentListId);
          const destList = newLists.find((list) => list.id === targetListId);

          const [movedCard] = sourceList.cards.splice(currentIndex, 1);

          destList.cards.splice(targetIndex, 0, movedCard);

          dragCard.current = { listId: targetListId, index: targetIndex };

          return newLists;
        });
      }
    }
  };

  const handleListDragStart = (e, index) => {
    dragList.current = index;
    dragListNode.current = e.target;
    dragListNode.current.addEventListener("dragend", handleListDragEnd);

    setTimeout(() => {
      setActiveList(index);
    }, 0);
  };

  const handleListDragEnd = () => {
    if (activeList !== null) {
      showToast("List position updated", "info");
    }

    setActiveList(null);
    dragList.current = null;
    if (dragListNode.current) {
      dragListNode.current.removeEventListener("dragend", handleListDragEnd);
      dragListNode.current = null;
    }
  };

  const handleListDragEnter = (e, targetIndex) => {
    if (activeList !== null && dragList.current !== targetIndex) {
      setLists((prevLists) => {
        const newLists = [...prevLists];
        const draggedList = newLists[dragList.current];
        newLists.splice(dragList.current, 1);
        newLists.splice(targetIndex, 0, draggedList);
        dragList.current = targetIndex;

        return newLists;
      });
    }
  };
  const toggleCardCompleted = (cardId, listId) => {
    const card = lists
      .find((list) => list.id === listId)
      ?.cards.find((card) => card.id === cardId);

    setLists(
      lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map((card) => {
              if (card.id === cardId) {
                return {
                  ...card,
                  completed: !card.completed,
                };
              }
              return card;
            }),
          };
        }
        return list;
      })
    );

    showToast(
      card && !card.completed
        ? `Marked "${card.title}" as completed`
        : `Unmarked "${card.title}" as completed`,
      "success"
    );
  };
  const showToast = (message, type = "info") => {
    switch (type) {
      case "success":
        toast.success(message, {
          style: {
            background: "rgba(220, 252, 231, 0.85)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#166534",
          },
        });
        break;
      case "error":
        toast.error(message, {
          style: {
            background: "rgba(254, 226, 226, 0.85)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#991b1b",
          },
        });
        break;
      case "info":
        toast.info(message, {
          style: {
            background: "rgba(219, 234, 254, 0.85)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#1e40af",
          },
        });
        break;
      case "warning":
        toast.warning(message, {
          style: {
            background: "rgba(254, 243, 199, 0.85)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#92400e",
          },
        });
        break;
      default:
        toast(message, {
          style: {
            background: "rgba(249, 250, 251, 0.85)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#111827",
          },
        });
    }
  };
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-800">
      <header className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-md border-b border-white border-opacity-20 shadow-lg text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-md flex items-center justify-center shadow-lg">
              <i className="fas fa-trello text-white text-lg"></i>
            </div>
            <h1 className="text-2xl font-bold">Logiqids Board</h1>
          </div>
          <button
            className="bg-red-500 bg-opacity-80 hover:bg-opacity-100 px-4 py-2 rounded-md text-white transition-all duration-300 shadow-md"
            onClick={resetBoard}
          >
            Reset Board
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-x-visible p-6 overflow-y-auto relative z-0">
        <div className="flex space-x-5 items-start">
          {lists.map((list, listIndex) => (
            <div
              key={list.id}
              className={`bg-white bg-opacity-20 backdrop-filter backdrop-blur-md rounded-lg shadow-xl w-72 flex-shrink-0 flex flex-col h-auto border border-white border-opacity-20
                ${
                  activeList === listIndex ? "opacity-70" : "opacity-100"
                } transition-all duration-300`}
              draggable
              onDragStart={(e) => handleListDragStart(e, listIndex)}
              onDragEnter={(e) => handleListDragEnter(e, listIndex)}
            >
              {showColorPicker && colorPickerListId === list.id && (
                <div className="absolute top-12 right-0  bg-white bg-opacity-80 backdrop-filter backdrop-blur-md rounded-md shadow-lg p-2 w-36 border border-white border-opacity-30 z-50">
                  {colorOptions.map((color) => (
                    <div
                      key={color.value}
                      className={`flex items-center p-1 cursor-pointer bg-opacity-10  hover:bg-gray-400 hover:bg-opacity-100 rounded transition-colors ${
                        color.value === list.color ? "font-bold" : ""
                      }`}
                      onClick={() => changeListColor(list.id, color.value)}
                    >
                      <div
                        className={`w-4 h-4 mr-2 rounded-full ${color.value}`}
                      ></div>
                      <span className="text-gray-800 ">{color.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <div
                className={`${
                  list.color || "bg-blue-100"
                } bg-opacity-30 p-3 rounded-t-lg flex justify-between items-center relative backdrop-filter backdrop-blur-sm border-b border-white border-opacity-20`}
              >
                {editingListId === list.id ? (
                  <div className="w-full">
                    <input
                      type="text"
                      className="w-full p-1 bg-white bg-opacity-80 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingListTitle}
                      onChange={(e) => setEditingListTitle(e.target.value)}
                      onBlur={saveListTitle}
                      onKeyDown={(e) => e.key === "Enter" && saveListTitle()}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="flex items-center w-full  position-relative">
                    <div
                      className="font-bold cursor-pointer flex-grow text-gray-800"
                      onClick={() => startEditingList(list.id, list.title)}
                    >
                      {list.title}
                    </div>
                    <div className="flex items-center ">
                      <button
                        className="w-4 h-4 mr-2 border border-gray-400 rounded-full cursor-pointer "
                        style={{
                          backgroundColor:
                            list.color && list.color.includes("bg-blue")
                              ? "#3B82F6"
                              : list.color && list.color.includes("bg-green")
                              ? "#22C55E" 
                              : list.color && list.color.includes("bg-yellow")
                              ? "#EAB308" 
                              : list.color && list.color.includes("bg-orange")
                              ? "#F97316" 
                              : list.color && list.color.includes("bg-red")
                              ? "#EF4444" 
                              : list.color && list.color.includes("bg-purple")
                              ? "#8B5CF6" 
                              : list.color && list.color.includes("bg-pink")
                              ? "#EC4899" 
                              : list.color && list.color.includes("bg-indigo")
                              ? "#6366F1"
                              : list.color && list.color.includes("bg-teal")
                              ? "#14B8A6" 
                              : "#3B82F6", 
                        }}
                        
                        onClick={(e) => {
                          e.stopPropagation();
                          setColorPickerListId(list.id);
                          setShowColorPicker(!showColorPicker);
                        }}
                      />
                      <button
                        className="text-gray-600 hover:text-red-500 transition-colors"
                        onClick={() => deleteList(list.id)}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                )}

              
              </div>

              <div className="p-3 overflow-y-auto max-h-96">
                {list.cards.map((card, cardIndex) => (
                  <div
                    key={card.id}
                    className={`bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-3 rounded-md shadow-md mb-3 cursor-pointer border border-white border-opacity-30 hover:shadow-lg transition-all duration-300
                      ${
                        activeCard?.id === card.id
                          ? "opacity-60"
                          : "opacity-100"
                      }
                      ${card.completed ? "bg-opacity-60" : ""}`}
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, {
                        id: card.id,
                        listId: list.id,
                        index: cardIndex,
                      })
                    }
                    onDragEnter={(e) => {
                      e.preventDefault();
                      handleDragEnter(e, { listId: list.id, index: cardIndex });
                    }}
                  >
                    <div className="flex items-start">
                      <div
                        className={`mr-2 mt-1 w-4 h-4 border rounded cursor-pointer flex-shrink-0 ${
                          card.completed ? "bg-green-400" : "border-gray-400"
                        } transition-colors`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCardCompleted(card.id, list.id);
                        }}
                      >
                        {card.completed && (
                          <div className="w-full h-full flex items-center justify-center text-white text-xs">
                            ✓
                          </div>
                        )}
                      </div>
                      <div
                        className="flex-1"
                        onClick={() => openCardModal(card, list.id)}
                      >
                        <div
                          className={`font-medium text-gray-800 ${
                            card.completed ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {card.title}
                        </div>
                        {card.dueDate && (
                          <div className="flex items-center text-xs text-gray-600 mt-1">
                            <Calendar size={12} className="mr-1" />
                            {new Date(card.dueDate).toLocaleDateString()}
                          </div>
                        )}
                        {card.description && (
                          <div className="text-xs text-gray-600 mt-1 truncate">
                            {card.description}
                          </div>
                        )}
                      </div>
                      <button
                        className="text-gray-500 hover:text-blue-600 ml-2 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCardModal(card, list.id);
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

            
              </div>

              <AddCardForm listId={list.id} onAddCard={addCard} />
            </div>
          ))}

          <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-md rounded-lg w-72 flex-shrink-0 p-2 h-auto self-start border border-white border-opacity-30 shadow-xl">
            {showAddList ? (
              <div className="p-3">
                <input
                  type="text"
                  className="w-full p-2 bg-white bg-opacity-80 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  placeholder="Enter list title..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 bg-opacity-80 hover:bg-opacity-100 text-white px-3 py-2 rounded transition-all duration-300 shadow-md"
                    onClick={addList}
                  >
                    Add List
                  </button>
                  <button
                    className="bg-white bg-opacity-30 hover:bg-opacity-50 text-white px-3 py-2 rounded transition-all duration-300"
                    onClick={() => {
                      setShowAddList(false);
                      setNewListTitle("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="w-full p-3 text-white hover:bg-white hover:bg-opacity-30 rounded-md text-left transition-all duration-300 flex items-center"
                onClick={() => setShowAddList(true)}
              >
                <Plus size={20} className="mr-2" />
                Add another list
              </button>
            )}
          </div>
        </div>
      </div>


      <footer className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-md p-4 text-center text-white border-t border-white border-opacity-20 shadow-lg">
  <p className="font-medium">
    Crafted with precision by <span className="font-bold text-indigo-300">Xahim</span> — where clean code meets bold design © {new Date().getFullYear()}
  </p>
</footer>


      {showCardModal && editingCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-md rounded-lg shadow-2xl w-full max-w-md border border-white border-opacity-30 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <CardModal
              card={editingCard}
              onClose={() => setShowCardModal(false)}
              onUpdate={updateCard}
              onDelete={deleteCard}
            />
          </div>
        </div>
      )}

      <GlassModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
