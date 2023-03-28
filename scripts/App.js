export default class App {

    constructor() {

        this.dialogState = false;

        this.$editWindow = $("#edit-window");

        this.initApp();


        this.fetchLevelList();

        this.initMenuHandlers();

        this.initMenuButtons();

        this.initMyDragAndDrop();

    }


    initApp() {

    }


    initMenuHandlers() {
        //TODO
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


    fetchLevelList() {
        // TODO
        let params = {
            "userid": "test"
        }

        let userID = "pg24pedro";

        $.post(`/api/get_level_list/${userID}`, params )
            .then( response => JSON.parse( response ))
            .then( data => {
                this.updateLevelList( data );
            });


        // TODO
        this.fetchLevel();
    }


    fetchLevel() {
        // TODO
    }


    initMenuButtons() {
        // TODO

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
        // TODO
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