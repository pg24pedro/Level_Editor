export default class App {

    constructor() {
        // this is where we build an instance of this app
        this.dialogState = false;

        this.$editWindow = $("#edit-window");

        // initialize the app itself
        this.initApp();

        // Go get all the prefabs
        this.fetchPrefabs();

        // Go get the list of levels
        this.fetchLevelList();

        // Handle user selections, new level or load level?
        this.initMenuHandlers();

        // Init level editing handlers (draggables, dialogs, save)
        this.initMenuButtons();

        //this.initDragHandler();

        this.initMyDragAndDrop();

    }


    initApp() {

    }


    initMenuHandlers() {
        // TODO: Init the menu bar click handlers
    }

    initMyDragAndDrop()
    {
        const myAssets = document.querySelectorAll('#asset-scroll img');
        const myEditorArea = document.querySelector('#edit-window')

        myAssets.forEach((image) => {
            image.addEventListener('dragstart',(event) => {
                event.dataTransfer.setData('text/plain',event.target.id);
            });
        })
        

        myEditorArea.addEventListener('dragover', (event) =>{
            event.preventDefault();
        });

        myEditorArea.addEventListener('drop', (event) => {
            event.preventDefault();
            const data = event.dataTransfer.getData('text/plain');
            const draggedImage = document.getElementById(data);

            const droppedImage = draggedImage.cloneNode(true);

            droppedImage.style.top = `${event.offsetY}px`;
            droppedImage.style.left = `${event.offsetX}px`;
            
            myEditorArea.appendChild(droppedImage);

        });

    }

    fetchPrefabs() {
        // TODO: Go to the server and get the list of prefabs
    }


    fetchLevelList() {
        // TODO: Go to the server and get the list of levels
        // then load the selection list, wait for selection
        let params = {
            "userid": "test"
        }

        let userID = "pg24pedro";

        $.post(`/api/get_level_list/${userID}`, params )
            .then( response => JSON.parse( response ))
            .then( data => {
                this.updateLevelList( data );
            });


        // TODO:  hook up the level select handlers

        // After level selected, load the level
        this.fetchLevel();
    }


    fetchLevel() {
        // TODO: go use teh named level and fetch it from the server
    }


    initMenuButtons() {
        // TODO: Add properties to menu buttons

        const levelButton = $("#save-level");
        levelButton.click( e => {
            this.saveToFile();
        });

        $("info-form").submit(
            e=> {
                e.preventDefault();
            }
        );

    }


    updateLevelList(data) {
        // TODO: fill in the level list select options from the data
        if (data.error)
            return;

        const $list = $("#level-list");
        $list.html("")
        for (let level of data.payload) {

            let markup = `<option value="${level.filename}">${level.name}</option>`;
            $list.append(markup);
        }
    }


    saveToFile() {

        const images = document.querySelectorAll("#edit-window img");
        const imagePositions = [];

        images.forEach(img => {
            const position = {
                type: img.src,
                x: img.offsetLeft + img.width / 2,
                y: img.offsetTop + img.height / 2
            };
            imagePositions.push(position);
        });
    
        const json = JSON.stringify(imagePositions);
        const parsedJson = JSON.parse(json);
       
        fetch('/api/save_level', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        }).then(response => {
            if (response.ok) {
                console.log('Level saved successfully');
            } else {
                console.log('Failed to save level');
            }
        }).catch(error => {
            console.log('Error saving level', error);
        });
    }
}