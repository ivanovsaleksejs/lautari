## Lautari

Lautari is a board game that combines simplicity of a design and ease of learning with strategic depth, offering players countless combinations and tactical opportunities. In this two-player game, opponents vie for control of a central area on the board by maneuvering their pieces and aiming to establish a winning formation. The ability to promote pieces and create a large variety of combinations adds layers of complexity and challenge. Success requires a balance of careful planning and timely execution, as every decision shapes the flow and outcome of the match. The game's complexity grows with the central cell's connection to all surrounding cells, enabling swift maneuvers and rapid formation changes. The victory conditions encourage thoughtful, deliberate strategies, rewarding players who rely on calculated combinations over reckless aggression.

---

### Build instructions

To build the project locally, run `yarn && yarn build` if you are using yarn, or `npm install && npm run build`. The project will be built into `dist` directory.

A working demo (playable locally, no multiplayer yet) can be found [here](https://ivanovsaleksejs.github.io/lautari/).

---

### How to play

In this game, two players face off in a strategic contest to control the center of the board. The game board consists of two starting positions (home area), each having three rows, five cells in each, and a center area where the most action occurs. The center area has one central cell surrounded by three circles, each containing 20 cells. The center area connected to the home areas with two additional rows.

Each player begins the game with 15 pieces, called Pawn, arranged in three rows of five pieces each. One player controls the white pieces, while the other controls the black pieces. The whites move first. A Pawn can move one step to any adjacent cell that shares a common edge with its current position. The center cell is uniquely connected to all cells within the inner circle.

![Pawn](src/images/pawn.png) ![Center cell](src/images/center.png)

If a piece moves to a cell occupied by an opponent's piece, that piece is captured and removed from the board. Any piece can capture any other piece. There are no forced takes, meaning that the player can choose not to capture a piece even if they have that option.

---

### Promotions

Pieces can be promoted to have a different role than the Pawn. Promotions can occur by reaching specific cells or by arranging pieces in specific formations.

If three pieces are placed in a straight line on adjacent cells connected by edges (either along the same row or within the same circle), the middle piece can be promoted to Infantry, provided it has not already been promoted and the middle cell is not in the home area. Note that diagonal placements do not qualify, as the cells must share edges to form a valid line. Additionally, the cells must form a continuous, straight alignment; configurations where cells are edge-connected but not in a straight line or an arc do not count. If the middle cell is the center cell of the board, the other two pieces must occupy cells that are directly opposite each other. The promotion takes one turn to complete, meaning that instead of moving any piece, player uses the turn to promote the piece. The Infantry piece is marked by a ⇧ symbol and can move up to 2 steps at a time. Movement may not be in one direction, for example, piece can make a step forward and a step left.

![Promotion formation](src/images/promotion.png) ![Infantry](src/images/infantry.png)

---

### Rider

If a piece reaches the Rider promotion cell (a circular cell on the left side of the center area, marked by a ⇯), it is promoted to a Rider automatically, without requiring a turn. The Rider piece is marked by a ⇯ symbol. This piece can move up to 3 steps and can jump over other pieces. Same as Infantry, Rider can make steps in different directions.

![Rider](src/images/rider.png)

---

### Sentinel

If a piece reaches the Sentinel promotion cell (a circular cell on the right side of the center area, marked by a +), it is promoted to a Sentinel automatically, also without requiring a turn. The Sentinel piece is marked by a + symbol and can move up to 3 steps.

![Sentinel](src/images/sentinel.png)

---

### Sentinel feature

The Sentinel piece can revive a piece captured on the previous turn, provided the captured piece was in reach of the Sentinel revive range, which is 2. This revival undoes the previous turn, restoring the captured piece and moving the opponent's piece back to its previous position. The revived piece cannot be captured on the next turn, and any promotion it held before capture is lost - it's revived as a Pawn.

---

### Sentinel additional rules

Each player may only have one Sentinel piece at a time. If a Sentinel is captured, the player may promote another piece to become a Sentinel. If a piece is on the Sentinel promotion cell when Sentinel is captured, it must step off the Sentinel promotion cell and then step back to get promoted to Sentinel. If a piece is captured on a Rider promotion cell, and then revived by Sentinel, it's revived as a regular Pawn and must step off the Rider promotion cell and then step back to get promoted to Rider. If, in such case, the opponents piece is promoted to a Rider, after reviving it's demoted to its previous role.

https://github.com/user-attachments/assets/f6eefc4e-6e49-4a94-9399-f8dc68b88fd2

---

### Sentinel immunity

Sentinel in the central cell (A cell) can only be captured by other Sentinel or a Rider. If a Sentinel in a central cell revives any piece, it losts its immunity for one turn.

---

### Main objective

The main objective of the game is to gain control of the center. This is accomplished by placing a promoted piece in the center and positioning any two pieces in opposite cells within the inner circle.

![Winning position](src/images/winning.png)

The winner gets 2 points while the loser gets 0 points. If a winning formation is composed of a Sentinel in the center and two Rider pieces in the opposite cells of the inner circle, then the winner gets 3 points. If a central piece in the formation is a Pawn then the victory is not granted, as the Pawn is not promoted. However, this position allows player to promote the central Pawn on the next turn, which, if done, will instantly grant victory.

---

### Domination victory

The game can also be won by capturing all opponents pieces, provided that the player still has more than 7 pieces left. In such case, the winner is granted with 1 points while the loser gets 0 points.

### Draw

A draw is declared automatically if a player has fewer than three pieces remaining, as they can no longer achieve victory. A draw can also be declared at any time if both players agree. If draw is called or declared automatically, both players receive ½ points.