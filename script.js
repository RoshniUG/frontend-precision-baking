document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.querySelector(".search-form");
    const ingredientsInput = document.getElementById("ingredients");

    searchForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form submission

        const dish = ingredientsInput.value.trim();

        if (!dish) {
            alert("Please enter a dish name.");
            return;
        }

        try {
            // Call the Flask backend to fetch recipes from Gemini API
            const response = await fetch("http://localhost:5000/generate-recipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ dish: dish }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch recipes");
            }

            const data = await response.json();
            displayRecipes(data.recipe); // Display the recipe in the UI
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while fetching recipes. Please try again.");
        }
    });

    function displayRecipes(recipe) {
        // Clear previous results
        const resultsContainer = document.querySelector(".results-container");
        if (resultsContainer) {
            resultsContainer.innerHTML = ""; // Clear existing content
        }

        // Create a new recipe card
        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";

        const recipeContent = document.createElement("div");
        recipeContent.className = "recipe-content";

        const recipeTitle = document.createElement("h3");
        recipeTitle.className = "recipe-title";
        recipeTitle.textContent = "Generated Recipe";

        const recipeText = document.createElement("p");
        recipeText.textContent = recipe;

        recipeContent.appendChild(recipeTitle);
        recipeContent.appendChild(recipeText);
        recipeCard.appendChild(recipeContent);

        // Append the recipe card to the results container
        if (resultsContainer) {
            resultsContainer.appendChild(recipeCard);
        } else {
            // If results container doesn't exist, create one
            const newResultsContainer = document.createElement("div");
            newResultsContainer.className = "results-container";
            newResultsContainer.appendChild(recipeCard);
            document.querySelector(".search-container").appendChild(newResultsContainer);
        }
    }
});