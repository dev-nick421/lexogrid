<template>
  <div id="game">
    <div class="game-container">
      <div class="board">
        <div class="row" v-for="(row, rowIndex) in grid" :key="rowIndex">
          <div
            class="cell"
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            :class="cell.cellClass"
            @click="selectCell(rowIndex, colIndex)"
          >
            {{ cell.letter }}
          </div>
        </div>
      </div>
      <div class="word-input">
        <div class="current-word">
          <div
            class="cell"
            v-for="(cell, index) in selectedCells"
            :key="index"
            :class="cell.cellClass"
          >
            {{ cell.letter }}
          </div>
        </div>
        <button @click="submitWord" :disabled="isGameOver">✅</button>
      </div>
    </div>
    <div class="submitted-words">
      <p>Worte:</p>
      <ul>
        <li v-for="(word, index) in words" :key="index">{{ word }}</li>
      </ul>
    </div>
    <div class="score">
      <p>Score: {{ score }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, Ref } from "vue";

export default defineComponent({
  setup() {
    const grid: Ref<Array<Array<Cell>>> = ref([]);
    const currentWord: Ref<string> = ref("");
    const words: Ref<string[]> = ref([]);
    const score: Ref<number> = ref(0);
    const selectedCells: Ref<Cell[]> = ref([]);
    const isGameOver: Ref<boolean> = ref(false);
    const lastSelectedRow: Ref<number | null> = ref(null);
    const lastSelectedCol: Ref<number | null> = ref(null);

    interface Cell {
      letter: string;
      cellClass: string;
      selected: boolean;
    }

    // Generate Grid
    for (let i = 0; i < 4; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < 4; j++) {
        row.push({
          letter: generateRandomLetter(),
          cellClass: "open",
          selected: false,
        });
      }
      grid.value.push(row);
    }

    // Generate a set of random 'legal' letters
    // TODO: Maybe check against offical scrabble dictionary?
    function generateRandomLetter(): string {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      return alphabet[randomIndex];
    }

    function selectCell(rowIndex: number, colIndex: number): void {
      if (isSelected(rowIndex, colIndex)) {
        // If player selects the same cell twice -> reset
        resetSelection();
        return;
      }

      /*
        TODO: Player has to accept other players word for it to be valid ! 
        if not it moves to a new list "argueWords" or smth that will only be taken into account again if theres not a clear winner
      */
      if (selectedCells.value.length === 0) {
        // first cell selected
        currentWord.value = grid.value[rowIndex][colIndex].letter;
        selectedCells.value.push({
          letter: grid.value[rowIndex][colIndex].letter,
          cellClass: "selected",
          selected: true,
        });

        highlightAdjacentCells(rowIndex, colIndex); // animate adjacent cells

        console.log(grid.value[rowIndex][colIndex].cellClass);
        grid.value[rowIndex][colIndex].cellClass = "selected";
        lastSelectedRow.value = rowIndex;
        lastSelectedCol.value = colIndex;
      } else {
        // Check if it's adjacent
        if (isAdjacentToLastCell(rowIndex, colIndex)) {
          currentWord.value += grid.value[rowIndex][colIndex].letter;

          highlightAdjacentCells(rowIndex, colIndex);

          selectedCells.value.push({
            letter: grid.value[rowIndex][colIndex].letter,
            cellClass: "selected",
            selected: true,
          });

          console.log(grid.value[rowIndex][colIndex].cellClass);
          grid.value[rowIndex][colIndex].cellClass = "selected";
          lastSelectedRow.value = rowIndex;
          lastSelectedCol.value = colIndex;
        }
      }
    }

    function highlightAdjacentCells(rowIndex: number, colIndex: number): void {
      const directions = [
        { row: -1, col: 0 }, // Up
        { row: 1, col: 0 }, // Down
        { row: 0, col: -1 }, // Left
        { row: 0, col: 1 }, // Right
        { row: -1, col: -1 }, // Diagonal Up-Left
        { row: -1, col: 1 }, // Diagonal Up-Right
        { row: 1, col: -1 }, // Diagonal Down-Left
        { row: 1, col: 1 }, // Diagonal Down-Right
      ];

      for (let i = 0; i < grid.value.length; i++) {
        for (let j = 0; j < grid.value[i].length; j++) {
          if (!grid.value[i][j].selected) {
            grid.value[i][j].cellClass = "inactive";
          }
        }
      }

      for (const direction of directions) {
        const newRow = rowIndex + direction.row;
        const newCol = colIndex + direction.col;

        if (
          newRow >= 0 &&
          newRow < grid.value.length &&
          newCol >= 0 &&
          newCol < grid.value[newRow].length
        ) {
          if (!grid.value[newRow][newCol].selected) {
            // Check if the cell was not selected
            grid.value[newRow][newCol].cellClass = "canBeSelected";
          }
        }
      }
    }

    // Check if cell at row and col is selected
    function isSelected(rowIndex: number, colIndex: number): boolean {
      return grid.value[rowIndex][colIndex].cellClass === "selected";
    }

    // Check if the clicked cell is adjacent to the last selected cell
    function isAdjacentToLastCell(rowIndex: number, colIndex: number): boolean {
      if (lastSelectedRow.value === null || lastSelectedCol.value === null) {
        return true;
      }

      const rowDiff = Math.abs(rowIndex - lastSelectedRow.value);
      const colDiff = Math.abs(colIndex - lastSelectedCol.value);

      return rowDiff <= 1 && colDiff <= 1;
    }

    // Submit the current word
    // TODO: check if already taken, submit to server for other players
    function submitWord(): void {
      if (!isGameOver.value && selectedCells.value.length >= 3) {
        // Time cant be up and word is atleast 3 characters
        words.value.push(
          selectedCells.value.map((cell) => cell.letter).join("")
        ); // next level "loops are too bulky" (just sums up the letters to a word again)
        resetSelection();
      }
    }

    // Reset current selection
    function resetSelection(): void {
      currentWord.value = "";
      selectedCells.value = []; // Clear selected cells
      lastSelectedRow.value = null;
      lastSelectedCol.value = null;
      // Cells set to 'open'
      for (let i = 0; i < grid.value.length; i++) {
        for (let j = 0; j < grid.value[i].length; j++) {
          grid.value[i][j].cellClass = "open";
        }
      }
    }

    return {
      grid,
      currentWord,
      selectedCells,
      words,
      score,
      isGameOver,
      lastSelectedRow,
      lastSelectedCol,
      selectCell,
      submitWord,
    };
  },
});
</script>
