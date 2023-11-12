// 取得學號

mainTable = $('.activity-body.sync-scroll')

sleep = function (ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

eventChange = new Event("blur");

main = async function () {
    stuIDList = Object.keys(scores)

    for (let i = 0; i < stuIDList.length; i++) {
        console.log(`${i}/${stuIDList.length}`)
        
        // if (i > 5) {break}

        stuID = stuIDList[i]

        let {score, comment} = scores[stuID]
  
        let idSpan = mainTable.find(`[tipsy="submission.student.user_no"][original-title="${stuID}"]`)
        let row = idSpan.parents(`li.homework-row:first`)

        let giveScoreIcon = row.find(`.submission-operations`)
        // console.log(giveScoreIcon.length)
        // break
        giveScoreIcon.click()

        await sleep(1000)

        let existedFile = $(`.field.homework-data:visible .attachment-row`)
        // console.log(existedFile.length)
        // break
        if (existedFile.length > 1) {
            for (let j = 1; j < existedFile.length; j++) {
                let fileRow = existedFile.eq(j)
                fileRow.find(`a[original-title="刪除"]`).click()
                await sleep(500)
            }
            let giveScoreButtonFile = $(`#give-score:visible:first .popup-content:visible:first .popup-footer:visible:first button.button-green:visible:first`)
            giveScoreButtonFile.click()
            await sleep(500)
        }

        let scoreInput = $(`#give-score:visible:first .popup-content:visible:first .score-box input[name="score"]`)
        if (scoreInput.val() !== score + '') {
            scoreInput.val(score).change().blur()

            let giveScoreButtonFile = $(`#give-score:visible:first .popup-content:visible:first .popup-footer:visible:first button.button-green:visible:first`)
            giveScoreButtonFile.click()
            await sleep(500)
        }

        // 這邊應該會是錯的，我們稍微等一下試試看吧
        let commentInput = $(`#give-score:visible:first .popup-content:visible:first .score-box input[name="score"]`)
        if (scoreInput.val() !== score + '') {
            scoreInput.val(score).change().blur()

            let giveScoreButtonFile = $(`#give-score:visible:first .popup-content:visible:first .popup-footer:visible:first button.button-green:visible:first`)
            giveScoreButtonFile.click()
            await sleep(500)
        }

        if (existedFile.length > 0) {
            let closeIcon = $(`#give-score:visible:first .popup-header:visible:first a[close-popup="give-score"]`)
            closeIcon.click()
            // break
            await sleep(500)
            // break // 測試用
            continue
        }

        let selectFileButton = $(`.field.homework-data:visible .select-file button:first`)
        // console.log(selectFileButton.length)
        selectFileButton.click()
        await sleep(500)

        let searchInput = $(`.search-key:visible input`)
        while (searchInput.length === 0) {
            await sleep(500)
            searchInput = $(`.search-key:visible input`)
        }
        searchInput.val(prependFilename + '_' + stuID + '.pdf').change()
        try {
            searchInput[0].dispatchEvent(eventChange)
        } catch (e) {
          console.error(prependFilename + '_' + stuID + '.pdf')
          throw e
        }
        

        let searchButton = $(`.search-btn a:first:visible`).click()
        await sleep(500)

        let fileList = $(`.file-list:visible:first`)
        while(fileList.find(`.row`).length > 1 || fileList.find(`.row`).length === 0) {
            await sleep(500)
        }
        let fileCheckbox = fileList.find(`.row.file-list-item .check input[type="checkbox"]`)
        fileCheckbox.click()

        $(`.ipr-message input[type="checkbox"]`).click()

        let submitButton = $(`.file-select.popup-area:visible:first .popup-footer:visible:first .button:visible:first`)
        // console.log(submitButton.length)
        // console.log(submitButton[0])
        submitButton.click()

        await sleep(500)

        // --------------------

        // let scoreInput = $(`#give-score:visible:first .popup-content:visible:first .score-box input[name="score"]`)
        scoreInput.val(score).change().blur()
        // scoreInput[0].dispatchEvent(eventChange)

        let giveScoreButton = $(`#give-score:visible:first .popup-content:visible:first .popup-footer:visible:first button.button-green:visible:first`)
        //console.log(giveScoreButton.length)
        //console.log(giveScoreButton[0])
        giveScoreButton.click()

        // break
        await sleep(500)

        let closeIcon = $(`#give-score:visible:first .popup-header:visible:first a[close-popup="give-score"]`)
        closeIcon.click()

        // if (i === 1) {
        //     break   // 測試用    
        // }
        // break   // 測試用
        
        await sleep(500)
    }   
}

main()