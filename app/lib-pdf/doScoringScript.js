
// 取得學號

sleep = function (ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

eventChange = new Event("blur");
eventClick = new Event("click");
eventInput = new Event("input");

main = async function () {
    
    mainTable = $('.activity-body.sync-scroll:visible')

    if (mainTable.length === 0) {
        $(`[ng-click="ui.view = 'scores'"]:visible`).click()
        await sleep(3000)
        
        mainTable = $('.activity-body.sync-scroll:visible')
        while (mainTable.length === 0) {
            await sleep(1000)
            mainTable = $('.activity-body.sync-scroll:visible')
        }
    }

    
    stuIDList = Object.keys(scores)
    let waitCounter = 0

    for (let i = 0; i < stuIDList.length; i++) {
        console.log(`${i}/${stuIDList.length}`)
        
        // if (i > 5) {break}

        stuID = stuIDList[i]

        let {score, comment} = scores[stuID]

        // --------------------
        // 列表
  
        let idSpan = mainTable.find(`[tipsy="submission.student.user_no"][original-title="${stuID}"]`)
        let row = idSpan.parents(`li.homework-row:first`)

        let giveScoreIcon = row.find(`.submission-operations:first`)
        // console.log(giveScoreIcon.length)
        // break
        giveScoreIcon[0].dispatchEvent(eventClick)

        await sleep(5000)

        // --------------
        // 單一人的狀態

        // 檢查有沒有檔案
        let existedFile = $(`.upload-container:visible .upload:visible`)
        console.log({existedFile: existedFile.length})
        // console.log(existedFile.length)
        // break
        if (existedFile.length > 2) {
            for (let j = 0; j < existedFile.length; j++) {
                let fileRow = existedFile.eq(j)
                fileRow.find(`.ivu-btn-text:last`).click()
                await sleep(500)

                let deleteButton = $('.ivu-modal-content .ivu-modal-body .ivu-modal-confirm .ivu-btn-primary:visible')
                while (deleteButton.length === 0) {
                    await sleep(500)
                    deleteButton = $('.ivu-modal-content .ivu-modal-body .ivu-modal-confirm .ivu-btn-primary:visible')
                }
                deleteButton.click()

                await sleep(500)
                while (deleteButton.length > 0) {
                    await sleep(500)
                    deleteButton = $('.ivu-modal-content .ivu-modal-body .ivu-modal-confirm .ivu-btn-primary:visible')
                }
                await sleep(500)
            }
            await sleep(500)
        }
        else if (existedFile.length === 0) {

            // --------------------------
            // 選擇檔案

            /*
            if (existedFile.length > 0) {
                let closeIcon = $(`#give-score:visible:first .popup-header:visible:first a[close-popup="give-score"]`)
                closeIcon.click()
                // break
                await sleep(500)
                // break // 測試用
                continue
            }
            */

            let selectFileButton = $(`.add-file-btn:first`)
            // console.log(selectFileButton.length)
            selectFileButton[0].dispatchEvent(eventClick)
            await sleep(3000)

            // ----------------

            let searchInput = $(`.search-key:visible input`)
            waitCounter = 0
            while (searchInput.length === 0) {
                await sleep(500)
                searchInput = $(`.search-key:visible input`)

                if (waitCounter > 0 && waitCounter % 20 === 0) {
                    selectFileButton[0].dispatchEvent(eventClick)
                }
            }
            searchInput.val(prependFilename + '_' + stuID + '.pdf').change()
            try {
                searchInput[0].dispatchEvent(eventChange)
            } catch (e) {
              console.error(prependFilename + '_' + stuID + '.pdf')
              throw e
            }
            
            await sleep(500)
            let searchButton = $(`.search-btn a:first:visible`).click()
            await sleep(500)

            let fileList = $(`.file-list:visible:first`)
            waitCounter = 0
            while(fileList.find(`.row`).length > 1 || fileList.find(`.row`).length === 0) {
                await sleep(500)
                waitCounter++
                if (waitCounter > 0 && waitCounter % 20 === 0) {
                    searchButton[0].dispatchEvent(eventClick)
                }
            }
            let fileCheckbox = fileList.find(`.row.file-list-item .check input[type="checkbox"]`)
            fileCheckbox.click()

            $(`.ipr-message input[type="checkbox"]`).click()

            let submitButton = $(`.file-select.popup-area:visible:first .popup-footer:visible:first .button:visible:first`)
            // console.log(submitButton.length)
            // console.log(submitButton[0])
            submitButton.click()

            await sleep(500)
            while ($(`.search-btn a:first:visible`).length > 0) {
              await sleep(500)
            }
            await sleep(500)

        }

        // --------------------

        let scoreInput = $(`.input-score input`)
        while (Number(scoreInput.val()) !== Number(score + '')) {
            //scoreInput.val(score).change().blur()
            scoreInput.val(score)


            scoreInput[0].dispatchEvent(eventInput)
            await sleep(500)

            scoreInput[0].dispatchEvent(eventChange)

            //let giveScoreButtonFile = $(`#give-score:visible:first .popup-content:visible:first .popup-footer:visible:first button.button-green:visible:first`)
            //giveScoreButtonFile.click()
            await sleep(1000)
        }

        let commentInput = $(`.ivu-input-type-textarea textarea`)
        while (commentInput.val().trim() !== (comment + '').trim()) {
            commentInput.val(comment)

            commentInput[0].dispatchEvent(eventInput)
            await sleep(500)

            commentInput[0].dispatchEvent(eventChange)
            await sleep(1000)
        }

        // ------------
        // let scoreInput = $(`#give-score:visible:first .popup-content:visible:first .score-box input[name="score"]`)
        //scoreInput.val(score).change().blur()
        // scoreInput[0].dispatchEvent(eventChange)

        let giveScoreButton = $('.header-left:visible:first > button:visible:first')
        //console.log(giveScoreButton.length)
        //console.log(giveScoreButton[0])
        giveScoreButton.click()

        // break
        await sleep(5000)

        /*
        let closeIcon = $(`#give-score:visible:first .popup-header:visible:first a[close-popup="give-score"]`)
        closeIcon.click()

        // if (i === 1) {
        //     break   // 測試用    
        // }
        // break   // 測試用
        
        await sleep(500)
        */
    }   

    console.log(`================================================`)
    console.log(`FINISH`)
    console.log(`================================================`)
}

main()
