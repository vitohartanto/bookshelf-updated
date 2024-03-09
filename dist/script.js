// Declarate books array
const books = [];

// Declarate const RENDER_EVENT
const RENDER_EVENT = "render-book";

// Declarate const SAVED_EVENT
const SAVED_EVENT = "saved-book";

// Declarate const STORAGE_KEY
const STORAGE_KEY = "BOOK_APPS";

// When Submit button is clicked, function addBook will work
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    // event.preventDefault() to prevent the default trait of form that would refresh the page every submit
    event.preventDefault();
    addBook();
  });
  //
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

// Function addBook
function addBook() {
  const bookTitle = document.getElementById("title").value;
  const authorName = document.getElementById("author").value;
  const publishedYear = document.getElementById("year").value;
  const publishedYearInt = parseInt(publishedYear);
  const checkbox = document.getElementById("finished");
  const checkboxValue = checkFinished(checkbox);

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    bookTitle,
    authorName,
    publishedYearInt,
    checkboxValue
  );

  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Function checkFinished
function checkFinished(checkbox) {
  if (checkbox.checked) {
    return true;
  } else {
    return false;
  }
}

// Function generateId
function generateId() {
  return +new Date();
}

// Function generateBookObject
function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

// Custom Event named RENDER_EVENT
document.addEventListener(RENDER_EVENT, function () {
  const unfinishedBook = document.getElementById("books");
  unfinishedBook.innerHTML = "";

  const finishedBook = document.getElementById("finished-books");
  finishedBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      unfinishedBook.append(bookElement);
    } else finishedBook.append(bookElement);
  }
});

// Function makeBook
function makeBook(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;
  textTitle.classList.add("search-book-title");

  const textAuthor = document.createElement("h3");
  textAuthor.innerText = bookObject.author;

  const textYear = document.createElement("h3");
  textYear.innerText = bookObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add(
    "text-md",
    "md:text-2xl",
    "lg:text-lg",
    "xl:text-xl"
  );
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add(
    "flex",
    "justify-between",
    "items-center",
    "border",
    "rounded-2xl",
    "p-4",
    "my-4"
  );
  container.append(textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  //   FINISHED BOOK Buttons
  // Undo Button
  if (isComplete) {
    const undoButton = document.createElement("button");
    const undoButtonInner = document.createElement("i");
    undoButtonInner.classList.add(
      "hover:bg-gray-600",
      "p-1",
      "md:p-3",
      "lg:p-2",
      "md:text-3xl",
      "lg:text-xl",
      "xl:text-3xl",
      "sm:mx-2",
      "lg:mx-1",
      "border",
      "rounded-full",
      "cursor-pointer",
      "text-md",
      "fa-solid",
      "fa-rotate-left"
    );
    undoButton.append(undoButtonInner);

    undoButton.addEventListener("click", function () {
      undoBookFromFinished(bookObject.id);
    });

    // Edit Button
    const editButton = document.createElement("button");
    const editButtonInner = document.createElement("i");
    editButtonInner.classList.add(
      "hover:bg-gray-600",
      "p-1",
      "md:p-3",
      "lg:p-2",
      "md:text-3xl",
      "lg:text-xl",
      "xl:text-3xl",
      "sm:mx-2",
      "lg:mx-1",
      "border",
      "rounded-full",
      "cursor-pointer",
      "text-md",
      "fa-regular",
      "fa-pen-to-square"
    );

    editButton.append(editButtonInner);
    editButton.setAttribute("data-open-modal", "true");

    const editBox = document.createElement("dialog");
    editBox.classList.add("bg-gray-800", "w-96", "rounded-2xl", "border");

    const editBoxText = document.createElement("h1");
    editBoxText.innerText = "Update Book";
    editBoxText.classList.add("text-center", "my-4", "text-lg", "md:text-xl");

    const titleLabel = document.createElement("label");
    titleLabel.innerText = "Title";
    titleLabel.classList.add("text-center", "md:text-lg");
    const titleInput = document.createElement("input");
    titleInput.classList.add("m-4", "rounded-md");
    titleInput.setAttribute("type", "text");

    const authorLabel = document.createElement("label");
    authorLabel.innerText = "Author";
    authorLabel.classList.add("text-center", "md:text-lg");
    const authorInput = document.createElement("input");
    authorInput.classList.add("m-4", "rounded-md");
    authorInput.setAttribute("type", "text");

    const yearLabel = document.createElement("label");
    yearLabel.innerText = "Year";
    yearLabel.classList.add("text-center", "md:text-lg");
    const yearInput = document.createElement("input");
    yearInput.classList.add("m-4", "rounded-md");
    yearInput.setAttribute("type", "text");

    const inputContainer = document.createElement("form");
    inputContainer.classList.add("flex", "flex-col");

    inputContainer.append(
      titleLabel,
      titleInput,
      authorLabel,
      authorInput,
      yearLabel,
      yearInput
    );

    const blueUpdateButton = document.createElement("button");
    blueUpdateButton.classList.add(
      "mx-2",
      "px-4",
      "py-2",
      "border",
      "rounded-2xl",
      "bg-blue-600"
    );

    const cancelButton = document.createElement("button");
    cancelButton.classList.add(
      "mx-2",
      "px-4",
      "py-2",
      "border",
      "rounded-2xl",
      "bg-green-500"
    );

    const editButtonsContainer = document.createElement("div");
    editButtonsContainer.classList.add("text-center", "my-4");

    editButtonsContainer.append(blueUpdateButton, cancelButton);

    editBox.setAttribute("data-modal", "true");
    // cancelButton.setAttribute("data-close-modal", "true");
    editBox.append(editBoxText, inputContainer, editButtonsContainer);

    // Trash Button
    const trashButton = document.createElement("button");
    const trashButtonInner = document.createElement("i");
    trashButtonInner.classList.add(
      "hover:bg-gray-600",
      "p-1",
      "md:p-3",
      "lg:p-2",
      "md:text-3xl",
      "lg:text-xl",
      "xl:text-3xl",
      "sm:mx-2",
      "lg:mx-1",
      "border",
      "rounded-full",
      "cursor-pointer",
      "text-md",
      "fa-solid",
      "fa-trash"
    );
    trashButton.append(trashButtonInner);
    trashButton.setAttribute("data-open-modal", "true");

    const dialogBox = document.createElement("dialog");
    dialogBox.classList.add(
      "p-8",
      "bg-gray-800",
      "w-96",
      "m-auto",
      "border-2",
      "border-white",
      "rounded-2xl",
      "text-center"
    );
    const deleteThisText = document.createElement("div");
    deleteThisText.innerText = "Delete this ?";
    deleteThisText.classList.add("mb-4", "text-2xl");

    const redDeleteButton = document.createElement("button");
    redDeleteButton.innerText = "Delete";
    redDeleteButton.classList.add(
      "text-xl",
      "sm:text-2xl",
      "px-4",
      "py-2",
      "rounded-2xl",
      "mx-2",
      "bg-red-600",
      "border"
    );

    const greenCancelButton = document.createElement("button");
    greenCancelButton.innerText = "Cancel";
    greenCancelButton.classList.add(
      "text-xl",
      "sm:text-2xl",
      "px-4",
      "py-2",
      "rounded-2xl",
      "mx-2",
      "bg-green-500",
      "border"
    );

    dialogBox.setAttribute("data-modal", "true");
    greenCancelButton.setAttribute("data-close-modal", "true");
    dialogBox.append(deleteThisText, redDeleteButton, greenCancelButton);

    const parentDialog = document.getElementById("parent-dialog");
    parentDialog.appendChild(dialogBox);

    editButton.addEventListener("click", function () {
      editBox.showModal();
    });

    trashButton.addEventListener("click", function () {
      dialogBox.showModal();
    });

    greenCancelButton.addEventListener("click", function () {
      dialogBox.close();
    });

    redDeleteButton.addEventListener("click", function () {
      removeBookFromFinished(bookObject.id);
      dialogBox.close();
    });

    container.append(undoButton, editButton, trashButton);
  } else {
    // UNFINISHED BOOK Buttons
    // Check Button
    const checkButton = document.createElement("button");
    const checkButtonInner = document.createElement("i");
    checkButtonInner.classList.add(
      "hover:bg-gray-600",
      "p-1",
      "md:p-3",
      "lg:p-2",
      "md:text-3xl",
      "lg:text-xl",
      "xl:text-3xl",
      "sm:mx-2",
      "lg:mx-1",
      "border",
      "rounded-full",
      "cursor-pointer",
      "text-md",
      "fa-solid",
      "fa-check"
    );
    checkButton.append(checkButtonInner);

    checkButton.addEventListener("click", function () {
      addBookToFinished(bookObject.id);
    });

    // Edit Button
    const editButton = document.createElement("button");
    const editButtonInner = document.createElement("i");
    editButtonInner.classList.add(
      "hover:bg-gray-600",
      "p-1",
      "md:p-3",
      "lg:p-2",
      "md:text-3xl",
      "lg:text-xl",
      "xl:text-3xl",
      "sm:mx-2",
      "lg:mx-1",
      "border",
      "rounded-full",
      "cursor-pointer",
      "text-md",
      "fa-regular",
      "fa-pen-to-square"
    );

    editButton.append(editButtonInner);
    editButton.setAttribute("data-open-modal", "true");

    // Trash Button
    const trashButton = document.createElement("button");
    const trashButtonInner = document.createElement("i");
    trashButtonInner.classList.add(
      "hover:bg-gray-600",
      "p-1",
      "md:p-3",
      "lg:p-2",
      "md:text-3xl",
      "lg:text-xl",
      "xl:text-3xl",
      "sm:mx-2",
      "lg:mx-1",
      "border",
      "rounded-full",
      "cursor-pointer",
      "text-md",
      "fa-solid",
      "fa-trash"
    );
    trashButton.append(trashButtonInner);
    trashButton.setAttribute("data-open-modal", "true");

    const dialogBox = document.createElement("dialog");
    dialogBox.classList.add(
      "p-8",
      "bg-gray-800",
      "w-96",
      "m-auto",
      "border-2",
      "border-white",
      "rounded-2xl",
      "text-center"
    );
    const deleteThisText = document.createElement("div");
    deleteThisText.innerText = "Delete this ?";
    deleteThisText.classList.add("mb-4", "text-2xl");

    const redDeleteButton = document.createElement("button");
    redDeleteButton.innerText = "Delete";
    redDeleteButton.classList.add(
      "text-xl",
      "sm:text-2xl",
      "px-4",
      "py-2",
      "rounded-2xl",
      "mx-2",
      "bg-red-600",
      "border"
    );

    const greenCancelButton = document.createElement("button");
    greenCancelButton.innerText = "Cancel";
    greenCancelButton.classList.add(
      "text-xl",
      "sm:text-2xl",
      "px-4",
      "py-2",
      "rounded-2xl",
      "mx-2",
      "bg-green-500",
      "border"
    );

    dialogBox.setAttribute("data-modal", "true");
    greenCancelButton.setAttribute("data-close-modal", "true");
    dialogBox.append(deleteThisText, redDeleteButton, greenCancelButton);

    const parentDialog = document.getElementById("parent-dialog");
    parentDialog.appendChild(dialogBox);

    trashButton.addEventListener("click", function () {
      dialogBox.showModal();
    });

    greenCancelButton.addEventListener("click", function () {
      dialogBox.close();
    });

    redDeleteButton.addEventListener("click", function () {
      removeBookFromFinished(bookObject.id);
      dialogBox.close();
    });

    container.append(checkButton, editButton, trashButton);
  }

  return container;
}

// Function addBookToFinished
function addBookToFinished(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Function findBook
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

// Function removeBookFromFinished
function removeBookFromFinished(bookId) {
  console.log(bookId);
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Function undoBookFromFinished
function undoBookFromFinished(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Function findBookIndex
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

// Function saveData
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

// Function isStorageExist
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser is not supporting local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

// Function loadDataFromStorage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Function searchBook
function searchBook() {
  const input = document.getElementById("search-keyword").value.toLowerCase();
  const bookTitles = document.getElementsByClassName("search-book-title");

  for (const title of bookTitles) {
    const titleText = title.textContent.toLowerCase();

    if (titleText.includes(input)) {
      title.parentElement.parentElement.style.display = "flex";
    } else {
      title.parentElement.parentElement.style.display = "none";
    }
  }
}
