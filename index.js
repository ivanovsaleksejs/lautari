var e={},t=class e{constructor(e){return Object.assign(this,{props:{},data:{},children:{},listeners:{},preRender:{},postRender:{},...e,...this}),new Proxy(this,{get:(e,t,i)=>t in e?e[t]:t in e.children?e.children[t]:Reflect.get(e,t,i)})}lookup(e,t=[]){let i="string"==typeof e?new RegExp(`^${e.replace("*",".*")}$`):e;for(let[n,s]of Object.entries(this.children))i.test(n)||s.name&&i.test(s.name)?t.push(s):t=this.children[n].lookup(e,t);return t}assignProps(){Object.assign(this.node,this.props),this.props.style&&Object.assign(this.node.style,this.props.style),Object.entries(this.data).forEach((([e,t])=>this.node.dataset[e]=t))}attachListeners(){for(let[e,t]of Object.entries(this.listeners)){let i={};t instanceof Array&&([t,i]=t),this.node.addEventListener(e,t.bind(this),i)}}bindProps(){Object.entries(this.bindings??{}).forEach((([e,{get:t,set:i}])=>{Object.defineProperty(this,e,{get:t,set:i})}))}prepareChildren(){for(let[t,i]of Object.entries(this.children))i.name=i.name?i.name:isNaN(t)?t:i.constructor.name,i instanceof e||(this.children[t]=new e({parent:this,...i}))}async toString(){return await this.prepareNode(),this.node.outerHTML}async toNode(){return await this.prepareNode(),this.node}async createElement(){let e=this.name.toLowerCase();if(this.elementClass&&(e+=-1==e.indexOf("-")?"-element":"",!customElements.get(e))){if("string"==typeof this.elementClass){let e=(await import(`${this.elementClass}.js`)).default;this.elementClass=(t=e,class extends t{})}customElements.define(e,this.elementClass,this.elementProps??{})}var t;return document.createElement(e)}async render(e=!1){if(e&&this.node)for(;this.node.firstChild;)this.node.removeChild(this.node.firstChild);else this.node=await this.createElement(),this.assignProps(),this.bindProps(),this.attachListeners(),this.node.component=this;this.prepareChildren(),this.node.dispatchEvent(new CustomEvent(e?"rerendered":"rendered"))}async prepareNode(e=!1){if(!this.node||e){for(let e of Object.values(this.preRender))e(this);await this.render(e);for(let[e,t]of Object.entries(this.children))t.appendTo(this.node,e);for(let e of Object.values(this.postRender))e(this)}}async appendTo(t,i=""){return this.name=this.name?this.name:isNaN(i)?i:this.constructor.name,t instanceof Node&&(await this.prepareNode(),t.appendChild(this.node)),t instanceof e&&(t.children={...t.children,[i]:this},t.node&&(await this.prepareNode(),t.node.appendChild(this.node))),this}},i={files:"RBDEFGHIKLS",firstHomeFile:"E",lastHomeFile:"I",centerFile:"A",promotions:{pawn:{name:"pawn",steps:1},infantry:{title:"⇧",name:"infantry",steps:2,canJump:!1},rider:{title:"⇯",name:"rider",position:"R4",steps:3,canJump:!0},sentinel:{title:"+",name:"sentinel",position:"S11",steps:2}},resultsConditions:{positionVictoryPoints:2,dominationVictory:8,dominationVictoryPoints:.5,dominationVictoryPointsDisplay:"½",drawPoints:.5,drawPointsDisplay:"½"}},n=class extends t{name="cell";constructor(t=!1){super(),!1!==t&&(this.position=t,e.cellsData[t].cell=this)}listeners={click:t=>{let i=this.position;e.activePiece&&e.activePiece.movePiece(i)}}},s=class extends n{name="segment";constructor(t,n=0){super(),this.rotation=t,this.skew=72,this.offset=18,this.props.className="field"+((n+t)%2?" dark":""),this.position=(9==t?i.files[0]:19==t?i.files.slice(-1):i.files.slice(1,-1)[8-(t<9?t:18-t)])+(t<10?7-n:8+n),e.cellsData[this.position].cell=this}postRender={attr:e=>{["offset","rotation","skew","position"].map((t=>e.node.setAttribute(t,e[t]))),e.node.style.transform=`rotate(${(this.offset*this.rotation+this.offset/2).toFixed(2)}deg) skew(${this.skew.toFixed(2)}deg)`}}},o=class extends n{name="halo";props={className:"small"};position=i.centerFile;postRender={attr:t=>{this.node.setAttribute("position",this.position),e.cellsData[this.position].cell=this}}},r=class e extends t{name="halo";constructor(t){super(),this.props.className=2==t?"outer":t?"":"inner",this.children={outer:{children:{div:{children:{inner:{children:Object.fromEntries([...Object.entries(Array(20).fill().map(((e,i)=>new s(i,t)))),["halo",t?new e(t-1):new o]])}}}}}}}},a=class extends t{name="row";constructor(e){super(),this.children={0:new n("E"+e),1:new n("F"+e),2:new n("G"+e),3:new n("H"+e),4:new n("I"+e)}}},l=class extends t{constructor(e){super(),this.player=e,this.children={0:new a(11*(1-e)+3),1:new a(11*(1-e)+2),2:new a(11*(1-e)+1)}}},c=(e,t={})=>e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=h(e,t)).replace(/!\[video\]\((.+?)\)/g,'<video controls src="$1"></video>')).replace(/!\[(.*?)\]\((.+?)\)/g,'<img src="$2" alt="$1">')).replace(/^### (.+)$/gm,"<h3>$1</h3>")).replace(/^## (.+)$/gm,"<h2>$1</h2>")).replace(/^# (.+)$/gm,"<h1>$1</h1>")).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>")).replace(/\*(.+?)\*/g,"<i>$1</i>")).replace(/^\s*-\s+(.+)$/gm,"<li>$1</li>")).replace(/(<li>.*<\/li>)/gms,"<ul>$1</ul>")).replace(/\n/g,""),h=(e,t={})=>{for(let[i,n]of Object.entries(t)){let t=new RegExp(`:${i}`,"g");e=e.replace(t,n)}return e},p=(e,t)=>t[e],d=(e,t)=>t.indexOf(e),m=e=>e[0].toUpperCase()+e.slice(1),u=class extends HTMLElement{observableAttributes={position:this.renderPosition.bind(this)};constructor(){super()}connectedCallback(){new MutationObserver(((e,t)=>{for(let t of e){let e=t.attributeName;"attributes"===t.type&&this.observableAttributes[e]&&this.observableAttributes[e]()}})).observe(this,{attributes:!0})}renderPosition(){let e=0,t=0;if(this.component.taken){let i=this.getAttribute("position").slice(1);e=i>6?559:5,t=this.component.owner?(i-1)%6*40+5:975-(i-1)%6*40}else{let[s,o]=[(n=this.getAttribute("position")).slice(0,1),n.slice(1)],r=s>=i.firstHomeFile&&s<=i.lastHomeFile&&(o<=3||o>=12);if(e=100*(d(s,i.files)-d(i.firstHomeFile,i.files))+82,t=o>4?70*(14-o)+15:1020-70*o+20,!r){let n=d(s,i.files)-d(i.firstHomeFile,i.files)-2,r=o-8+(o>7),a=[269,204,143,99][4-Math.abs(r)],l=Math.abs(n)*Math.PI/10,c=s==i.files[0]&&4==o?25:s==i.files.slice(-1)&&11==o?11:18;e=300+(a*Math.sin(l)*(n>=0?1:-1)-c||-17),t=510-(a*Math.cos(l)*(r>=0?1:-1)+18||17)}}var n;this.style.left=e+"px",this.style.top=t+"px"}},f=class extends t{name="button-popup";constructor(e,t,i){super(),this.piece=e,this.func=t,this.title=i,this.children={button:{props:{innerText:this.title},listeners:{click:e=>{this.func()}}}}}remove=e=>{this.node.remove()};postRender={move:e=>{this.node.style=`top: ${parseInt(this.piece.node.style.top)-18}px; left: ${parseInt(this.piece.node.style.left)+18}px`}}},g=class extends t{name="piece";elementClass=u;constructor(e,t){super(),this.color=~~(e>14),this._role="pawn",this.taken=!1,this.owner=this.color,this.props.className=this.color?"white":"black",this._position=i.files.slice(3,-3)[e%5]+(e>14?3-~~((e-15)/5):14-~~(e/5)),this.updatePosition(this._position)}bindings={active:{set:e=>{this._active=e,e?this.node.classList.add("active"):this.node.classList.remove("active")},get:e=>this._active??!1},position:{set:e=>{this._position=e,this.node.setAttribute("position",e)},get:e=>this._position??null},role:{set:e=>{this._role=e,this.node.classList.remove(...Object.keys(i.promotions)),this.node.innerText="",e&&(this.node.classList.add(e),i.promotions[e].title&&(this.node.innerText=i.promotions[e].title))},get:e=>this._role}};postRender={attr:e=>{setTimeout((t=>e.node.setAttribute("position",e.position)),1)}};updatePosition=(t=!1)=>e.cellsData[t??this.position].piece=this;canMove=e=>this.allowedCells(this.position).length>0;allowedCells=(t,n)=>{let s=[],o=n>=i.promotions[this.role].steps,r=i.promotions[this.role].canJump;if(!n||!o){let i=e.game.getNeighbourCells(t);i=i.filter((e=>r&&!o?this.existingCell(e):o?this.allowedCell(e):this.existingCell(e))),s=i;for(let e of r&&!o?i:i.filter((e=>!this.occupiedCell(e))))s=[...new Set([...s,...this.allowedCells(e,(n??0)+1)])]}return s.filter(this.allowedCell)};existingCell=t=>typeof e.cellsData[t]<"u";occupiedCell=t=>null!=e.cellsData[t].piece;hasOwnPiece=t=>e.cellsData[t].piece.owner==this.owner;isRevived=t=>e.cellsData[t].piece.revived;allowedCell=e=>this.existingCell(e)&&(!this.occupiedCell(e)||!this.hasOwnPiece(e)&&!this.isRevived(e));isLegalMove=t=>{let i=this.allowedCells(this.position);return!e.cellsData[t].piece&&-1!==i.indexOf(t)};isLegalTake=t=>-1!==this.allowedCells(this.position).indexOf(t)&&e.cellsData[t].piece&&e.cellsData[t].piece.owner!=this.owner;showAllowed=t=>{let i=this.allowedCells(this.position);for(let t in i)e.cellsData[i[t]].cell.node.classList.add("allowed")};checkPromotion=t=>{this.position==i.promotions.rider.position&&("sentinel"==this.role&&(e.sentinels[["black","white"][this.owner]]=!1),this.role="rider"),this.position==i.promotions.sentinel.position&&!e.sentinels[["black","white"][this.owner]]&&(this.role="sentinel",e.sentinels[["black","white"][this.owner]]=!0)};changePosition=(t,i=!1)=>{e.cellsData[this.position].piece=null,e.cellsData[t].piece=this;let n={};i&&(n.taken=!0);let s=this.role,o=this.position;this.position=t,this.checkPromotion(),s!=this.role&&(n.promotion={old:s,new:this.role}),e.gameInfo.logMove([o.toLowerCase(),t.toLowerCase()],"move",n),this.active=!1,e.game.changePlayer()};movePiece=t=>{if(e.game.buttonPopup&&e.game.buttonPopup.remove(),this.isLegalMove(t))this.changePosition(t);else if(null!=e.cellsData[t].piece)if(e.cellsData[t].piece.owner==e.activePlayer)this.active=!1,e.activePiece=e.cellsData[t].piece;else if(this.isLegalTake(t)&&!e.cellsData[t].piece.revived){let i=e.cellsData[t].piece;i.taken=!0,"sentinel"==i.role&&(e.sentinels[["black","white"][i.owner]]=!1),i.role="pawn",i.previousPosition=t,i.position="X"+(+e.taken[["black","white"][i.owner]].length+1),e.taken[["black","white"][i.owner]].push(i),(7==+t.slice(1)||8==+t.slice(1))&&(e.gameInfo.centerBackup[i.owner?"white":"black"]=e.gameInfo.center[i.owner?"white":"black"]),this.changePosition(t,!0)}};checkPieceOwner=t=>typeof e.cellsData[t]<"u"&&null!==e.cellsData[t].piece&&e.cellsData[t].piece.owner==this.owner;showPopupButton=(t,i)=>{e.game.buttonPopup&&e.game.buttonPopup.remove(),e.game.buttonPopup=new f(this,t,i),e.game.buttonPopup.appendTo(this.node.parentNode)};checkInfantryPromotion=t=>{if("pawn"!=this.role)return!1;let[n,s]=[(o=this.position).slice(0,1),o.slice(1)];var o,r;if("A"!=n&&(s<4&&this.owner||s>11))return!1;if("A"==n){let t=e.game.getNeighbourCells(this.position);for(let e of t){let[t,n]=[(r=e).slice(0,1),r.slice(1)],s=p(i.files.length-d(t,i.files)-1,i.files)+(15-n);if(this.checkPieceOwner(e)&&this.checkPieceOwner(s))return!0}return!1}{let[t,i,n,s]=e.game.getNeighbourCells(this.position);return this.checkPieceOwner(t)&&this.checkPieceOwner(i)||this.checkPieceOwner(n)&&this.checkPieceOwner(s)}};checkLastMoveTaken=t=>{let i=e.gameInfo.log[e.gameInfo.log.length-1],n=this.allowedCells(this.position);return i.data&&i.data.taken&&-1!==n.indexOf(i.move[1].toUpperCase())};promoteInfantry=t=>{e.game.buttonPopup.remove();let i=this.role;this.role="infantry",this.active=!1;let n={promotion:{old:i,new:this.role}};e.gameInfo.logMove([this.position.toLowerCase()],"promote",n),e.game.changePlayer()};revive=t=>{e.game.buttonPopup.remove();let i=e.gameInfo.log[e.gameInfo.log.length-1],n=e.cellsData[i.move[1].toUpperCase()].piece,s=e.taken[["black","white"][~~!n.owner]].pop();n.position=i.move[0].toUpperCase(),s.position=i.move[1].toUpperCase(),e.cellsData[i.move[0].toUpperCase()].piece=n,e.cellsData[i.move[1].toUpperCase()].piece=s,s.taken=!1,s.revived=!0,e.revived=s,this.active=!1,e.gameInfo.logMove([this.position.toLowerCase()],"revive",{taker:i.move[0],taken:i.move[1]}),e.gameInfo.center[s.owner?"white":"black"]=e.gameInfo.centerBackup[s.owner?"white":"black"],e.gameInfo.centerBackup[s.owner?"white":"black"]=0,e.game.changePlayer()};makeActive=t=>{this.showAllowed(),this.checkInfantryPromotion()&&this.showPopupButton(this.promoteInfantry,"Promote"),"sentinel"==this.role&&this.checkLastMoveTaken()&&this.showPopupButton(this.revive,"Revive"),e.activePiece=this,this.active=!0};processClick=t=>{if(e.game.buttonPopup&&e.game.buttonPopup.remove(),e.activePiece){if(this.active&&e.activePlayer==this.owner)e.game.clearAllowed(),this.active=!1,e.activePiece=null;else if(e.activePlayer==this.owner&&this.canMove()){e.game.clearAllowed();for(let t in e.cellsData)e.cellsData[t].piece&&(e.cellsData[t].piece.active=!1);this.makeActive()}}else e.game.clearAllowed(),e.activePlayer==this.owner&&this.canMove()&&this.makeActive()};listeners={click:this.processClick}},w=class extends t{name="popup";constructor(e){super(),this.children.msg.props={innerHTML:e}}children={msg:{},closeButton:{listeners:{click:e=>{this.remove()}}}};remove=e=>{this.node.remove()}},v=class extends n{constructor(t,i,n){super(),this.name=i,this.position=n,this.props.innerText=t,e.cellsData[n].cell=this}},y=class extends t{name="game";children={blackside:{children:{black:new l(0)}},mainarea:{children:{rider:new v(i.promotions.rider.title,"rider",i.promotions.rider.position),gamearea:{children:{board:{children:Object.fromEntries([["center",{children:{inner:new r(2)}}],...Object.entries(Array(10).fill().map(((e,t)=>new s((t>4?t+5:t)+2,3))))])}}},sentinel:new v(i.promotions.sentinel.title,"sentinel",i.promotions.sentinel.position)}},whiteside:{children:{white:new l(1)}},...Object.fromEntries(Object.entries(Array(30).fill().map(((t,i)=>new g(i,e)))))};clearAllowed=t=>{for(let t in e.cellsData)e.cellsData[t].cell.node.classList.remove("allowed")};getNeighbourCells=e=>{let[t,n]=[(s=e).slice(0,1),s.slice(1)];var s;if(t==i.centerFile)return i.files.slice(0,-1).split("").map((e=>e+7)).concat(i.files.slice(1).split("").map((e=>e+8)));let o=d(t,i.files),[r,a]=[p(o?o-1:1,i.files),p(o<10?o+1:9,i.files)];r+=t==i.files[0]||t==i.files.slice(-1)||t==i.files[1]&&n>=8||t==i.files.slice(-1)&&n<=7?15-n:n,a+=t==i.files.slice(-2,-1)&&n<=7?15-n:n;let[l,c]=[7==n?i.centerFile:t+(+n+1),8==n?i.centerFile:t+(+n-1)];return[r,a,l,c]};checkWinningPosition=t=>{let n=e.cellsData[i.centerFile].piece;if(n&&"pawn"!=n.role){let t=!1,o=n.owner,r=this.getNeighbourCells(i.centerFile);for(let n of r)if(e.cellsData[n].piece&&e.cellsData[n].piece.owner==o){let[r,a]=[(s=n).slice(0,1),s.slice(1)],l=p(i.files.length-1-d(r,i.files),i.files)+(15-a);if(e.cellsData[l].piece&&e.cellsData[l].piece.owner==o){t=!0;break}}if(t){if(null!==o){let t=o?"white":"black",i=e.gameInfo.center[t]+1;if(e.gameInfo.center[t]=i,e.gameInfo.center[t]>=1)return{winner:o}}}else e.gameInfo.center.white=0,e.gameInfo.center.black=0}var s;return null};checkDominationVictory=t=>e.taken.white.length>14&&e.taken.black.length<i.resultsConditions.dominationVictory||e.taken.black.length>14&&e.taken.white.length<i.resultsConditions.dominationVictory?{winner:e.taken.black.length>14}:null;checkDraw=t=>e.taken.white.length>12&&e.taken.black.length>i.resultsConditions.dominationVictory-1||e.taken.black.length>12&&e.taken.white.length>i.resultsConditions.dominationVictory-1;changePlayer=t=>{this.clearAllowed();let n=null;e.activePiece=null,e.revived&&e.revived.owner!=e.activePlayer&&(e.revived.revived=!1,e.revived=null),e.activePlayer=~~!e.activePlayer,n=this.checkDominationVictory();let s=!1;n&&typeof n.winner<"u"&&(this.showPopup(`Domination victory!<br />The winner is ${n.winner?"White":"Black"}!<br />The winner gets ${i.resultsConditions.dominationVictoryPointsDisplay} points.`),this.endGame(),s=!0),n=this.checkWinningPosition(),n&&typeof n.winner<"u"&&(this.showPopup(`Position victory!<br />The winner is ${n.winner?"White":"Black"}!<br />The winner gets ${i.resultsConditions.positionVictoryPoints} points.`),this.endGame(),s=!0),this.checkDraw()&&(this.showPopup(`It's a draw!<br />Each player gets ${i.resultsConditions.drawPointsDisplay} points.`),this.endGame(),s=!0),e.activePlayer&&!s&&(e.gameInfo.turn=e.gameInfo.turn+1)};endGame=t=>{e.active=!1};showPopup=t=>{new w(t).appendTo(e.root)}},b=["### How to play","In this game, two players face off in a strategic contest to control the center of the board. The game board consists of two starting positions (home area), each having three rows, five cells in each, and a center area where the most action occurs. The center area has one central cell surrounded by three circles, each containing 20 cells. The center area connected to the home areas with two additional rows.","Each player begins the game with 15 pieces, called :pawn, arranged in three rows of five pieces each. One player controls the white pieces, while the other controls the black pieces. A :pawn can move one step to any adjacent cell that shares a common edge with its current position. The center cell is uniquely connected to all cells within the inner circle.","![Pawn](images/pawn.png) ![Center cell](images/center.png)","If a piece moves to a cell occupied by an opponent's piece, that piece is captured and removed from the board. Any piece can capture any other piece. There are no forced takes, meaning that the player can choose not to capture a piece even if they have that option.","---","### Promotions","Pieces can be promoted to have a different role than the :pawn. Promotions can occur by reaching specific cells or by arranging pieces in specific formations.","If three pieces are placed in a straight line on adjacent cells connected by edges (either along the same row or within the same circle), the middle piece can be promoted to :infantry, provided it has not already been promoted and the middle cell is not in the home area. Note that diagonal placements do not qualify, as the cells must share edges to form a valid line. Additionally, the cells must form a continuous, straight alignment; configurations where cells are edge-connected but not in a straight line or an arc do not count. If the middle cell is the center cell of the board, the other two pieces must occupy cells that are directly opposite each other. The promotion takes one turn to complete, meaning that instead of moving any piece, player uses the turn to promote the piece. The :infantry piece is marked by a :infantry_title symbol and can move up to :infantry_steps steps at a time. Movement may not be in one direction, for example, piece can make a step forward and a step left.","![Promotion formation](images/promotion.png) ![Infantry](images/infantry.png)","---","### :rider","If a piece reaches the :rider promotion cell (a circular cell on the left side of the center area, marked by a :rider_title), it is promoted to a :rider automatically, without requiring a turn. The :rider piece is marked by a :rider_title symbol. This piece can move up to :rider_steps steps and can jump over other pieces. Same as :infantry, :rider can make steps in different directions.","![:rider](images/rider.png)","---","### Sentinel","If a piece reaches the :sentinel promotion cell (a circular cell on the right side of the center area, marked by a :sentinel_title), it is promoted to a :sentinel automatically, also without requiring a turn. The :sentinel piece is marked by a :sentinel_title symbol and can move up to :sentinel_steps steps.","![Sentinel](images/sentinel.png)","---","### Sentinel feature","The :sentinel piece can revive a piece captured on the previous turn, provided the captured piece was in reach of the :sentinel. This revival undoes the previous turn, restoring the captured piece and moving the opponent's piece back to its previous position. The revived piece cannot be captured on the next turn, and any promotion it held before capture is lost. Each player may only have one :sentinel piece at a time. If a :sentinel is captured, the player may promote another piece to become a :sentinel.",":video","---","### Main objective","The main objective of the game is to gain control of the center. This is accomplished by placing a promoted piece in the center and positioning any two pieces in opposite cells within the inner circle. This configuration must remain intact for one turn to secure victory. For the black player, victory happens as soon as the configuration is made, since the turn ends after blacks move. The whites, however, must ensure that the blacks cannot disrupt the configuration during their turn - after the whites move and form the winning configuration, the blacks have a chance to take any of three pieces during the current turn. If they do not, the game is won by the whites. This rule balances the slight speed advantage whites have at the start of the game.","![Winning position](images/winning.png)","If either of the two pieces in the inner circle is captured and then revived by a :sentinel, the victory counter does not reset. However, if any of these pieces is moved, captured, and not revived, the counter resets.","The winner gets :position_victory_points points while the loser gets 0 points.","---","### Domination victory","The game can be won by capturing all opponents pieces, provided that the player still has more than 7 pieces left. In such case, the winner is granted with :domination_victory_points points while the loser gets 0 points.","### Draw","A draw is declared automatically if a player has fewer than three pieces remaining, as they can no longer achieve victory. A draw can also be declared at any time if both players agree. If draw is called or declared automatically, both players receive :draw_points points."],k=class extends t{name="tutorial";remove=e=>{this.node.remove()};tutorialToHTML=e=>({name:"tutorial-entry",props:{innerHTML:c(e,{video:"![video](images/sentinel.mp4)",pawn:m(i.promotions.pawn.name),infantry_title:i.promotions.infantry.title,infantry_steps:i.promotions.infantry.steps,infantry:m(i.promotions.infantry.name),rider_title:i.promotions.rider.title,rider_steps:i.promotions.rider.steps,rider:m(i.promotions.rider.name),sentinel_title:i.promotions.sentinel.title,sentinel_steps:i.promotions.sentinel.steps,sentinel:m(i.promotions.sentinel.name),position_victory_points:i.resultsConditions.positionVictoryPoints,domination_victory_points:i.resultsConditions.dominationVictoryPointsDisplay,draw_points:i.resultsConditions.drawPointsDisplay})}});prepareTutorial=(e,t)=>({name:"tutorial-page",props:{className:t?"":"active"},children:Object.fromEntries(Object.entries(e.map(this.tutorialToHTML)))});tutorialContent=Object.fromEntries(Object.entries(((e,t)=>e.reduce(((e,i)=>(i===t?e[e.length-1].length>0&&e.push([]):e[e.length-1].push(i),e)),[[]]))(b,"---").map(this.prepareTutorial)));children={popupWrapper:{children:{popup:{children:{closebutton:{listeners:{click:e=>{this.remove()}}},tutorialContent:{children:this.tutorialContent},next:{props:{innerText:"Next"},listeners:{click:e=>{let t=this.lookup("tutorial-page"),i=t.findIndex((e=>e.node.classList.contains("active")));t[i].node.classList.remove("active"),i++,i=i<t.length?i:0,t[i].node.classList.add("active")}}}}}}}}},P=class extends t{name="log-move";constructor(e){super(),this.props.innerText=e}},C=class extends t{name="log-separator";props={innerText:" - "}},T=class extends t{name="log-entry";constructor(e){super(),this.children={0:new P(e)}}},x=class extends t{name="game-info";constructor(){super(),this._turn=1,this.center={white:0,black:0},this.centerBackup={white:0,black:0},this.currentLog=null,this.log=[]}bindings={turn:{set:e=>{this.infoTable.generalInfo.turnNumber.node.innerText=e,this._turn=e},get:e=>this._turn}};moveInfo=(e,t,i)=>e.join(" ")+(i.taken?"revive"==t?`*${i.taker}, ${i.taken}`:"x":"")+(i.promotion?`^${i.promotion.new[0].toUpperCase()}`:"");logMove=(t,i,n)=>{let s=this.moveInfo(t,i,n);this.log.push({turn:this.turn,player:e.activePlayer,move:t,type:i,data:n}),this.currentLog?((new C).appendTo(this.currentLog),new P(s).appendTo(this.currentLog),this.currentLog=null):(this.currentLog=new T(s),this.currentLog.appendTo(this.infoTable.turnLog))};showTutorial=t=>{(new k).appendTo(e.root)};children={options:{children:{help:{listeners:{click:e=>{this.showTutorial()}}}}},infoTable:{children:{generalInfo:{children:{turnNumber:{props:{innerText:1}},status:{}}},turnLog:{}}}}},D=t=>{e.cellsData=Object.fromEntries([[i.centerFile,{cell:null,piece:null}]].concat(...i.files.split("").map((e=>{let[t,n]=[i.files[0],i.files.slice(-1)],s=e>=i.firstHomeFile&&e<=i.lastHomeFile,o=e==t||e==n;return Array(s?14:o?4:6).fill().map(((t,i)=>((e,t,i,n,s)=>[t+(e+(n?1:s?t==i?8:4:5)),{cell:null,piece:null}])(i,e,n,s,o)))})))),e.taken={black:[],white:[]},e.sentinels={black:!1,white:!1},e.activePiece=null,e.activePlayer=1,e.revived=null,e.active=!0,e.game=new y,e.game.appendTo(e.root),e.gameInfo=new x,e.gameInfo.appendTo(e.root),e.gameInfo.turn=1};e.root=document.body,D();