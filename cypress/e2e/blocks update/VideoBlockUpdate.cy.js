describe('Video block update testing', () => {

    before('Очищаю группы и предметы',() =>{
        cy.login()
        cy.getMySubjects('testSubject')
        cy.deleteAfterSubject('id_subject')
    }) 


    beforeEach( () => {
        cy.login()
        cy.createSubject('testSubject','id_subject')
        cy.createGroup('testGroup','id_subject','id_group')
        cy.createLesson('testLesson','id_group','id_lesson')
        cy.createTask('testTask', 'id_lesson','id_task')
        cy.createBlockVideo('testBlock','id_task', 'id_block')

        
        cy.intercept({
            method: 'PUT',
            url: '**/block/**',
        }).as('matchedUpdateVideo')                           

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth')  

        cy.intercept({
            method: 'POST',
            url: 'https://uploader.ipst-dev.com/video/upload',
        }).as('matchedUploader')  

        cy.visitGroup('id_subject','id_group')

        cy.wait('@matchedAuth') 

        cy.contains('testLesson')
        .parent()
        .parent()
        .find('[data-testid="KeyboardArrowDownIcon"]')
        .click()
        .wait(500)

        cy.contains('testTask')
        .parent()
        .parent()
        .find('[data-testid="KeyboardArrowDownIcon"]')
        .click()
        .wait(500)

        cy.contains('testBlock')
        .parent()
        .parent()
        .parent()
        .find('[data-testid="EditIcon"]')
        .click()
        .wait(500)
        
       
        
        // cy.wait('@matchedUrlCount').then(({response}) =>{
        //     expect(response.statusCode).to.eq(200)
        // })*/

    })

    afterEach(() =>{
        cy.login()
        cy.getMySubjects('testSubject')
        cy.deleteAfterSubject('id_subject')
    })


    it.skip('Основной сценарий - редактирование блока видео без добавления нового видео', () => {
   
        // cy.contains('Загрузить другое видео')
        // .click()

        // cy.get('input[id="icon-button-file"]')
        //     .attachFile('testVideo.mp4')
        // cy.wait(500)
        //cy.wait('@matchedUploader')

        cy.get('input[name="videoName"]')
            .clear()
            .type('test')

        cy.get('textarea[name="videoTranscript"]')
            .clear()
            .type('aa')

        cy.contains('Создано на Новой Платформе')
            .click()

        cy.contains('Я являюсь автором')
            .click()

        cy.get('textarea[name="videoSource"]')
            .clear()
            .type('аа')

        cy.get('textarea[name="authorName"]')
            .clear()
            .type('аа')

        cy.get('button[type="submit"]')
            .click()

        cy.wait('@matchedUpdateVideo').then(({response}) =>{
            expect(response.statusCode).to.eq(200)
        })
        cy.contains('Ваше видео test успешно изменено')
            .should('exist')
    })

    it.skip('Альтернативный сценарий - пустые поля', () => {
        
        cy.contains('Загрузить другое видео')
            .click()

        cy.get('input[name="videoName"]')
            .clear()

        cy.get('textarea[name="videoTranscript"]')
            .clear()

        cy.contains('Создано на Новой Платформе')
            .click()

        cy.contains('Я являюсь автором')
            .click()

        cy.get('textarea[name="videoSource"]')
            .clear()

        cy.get('textarea[name="authorName"]')
            .clear()

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Загрузите видеофайл')
            .should('exist')

        cy.contains('Поле "Название видео" не должно быть пустым')
            .should('exist')

        cy.contains('Необходимо указать источник заимствования')
            .should('exist')

        cy.contains('Необходимо указать имя автора')
            .should('exist')
    })

    it.skip('Альтернативный сценарий - неверный формат видео', () => {
        
        cy.contains('Загрузить другое видео')
        .click()

        cy.get('input[id="icon-button-file"]')
            .attachFile('testImage.jpg')

        //cy.wait('@matchedUploader')

        cy.contains('Допустимые форматы видео: MP4')
        .should('exist')

    })

    it.skip('Альтернативный сценарий - размер файла превышает допустимый', () => {
        
        cy.contains('Загрузить другое видео')
        .click()

        cy.get('input[id="icon-button-file"]')
        .attachFile('bigVideo.mp4')
        // cy.wait('@matchedUploader')

        cy.contains('Размер видео превышает максимально допустимый объем равный 10 Мб')
        .should('exist')
    })

    it.skip('Альтернативный сценарий - минимальное количество символов текстовых полей', () => {

        cy.get('input[name="videoName"]')
            .clear()
            .type('а')

        cy.contains('Создано на Новой Платформе')
            .click()

        cy.contains('Я являюсь автором')
            .click()

        cy.get('textarea[name="videoSource"]')
            .clear()
            .type('а')

        cy.get('textarea[name="authorName"]')
            .clear()
            .type('а')

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Введите не менее 2 и не более 250 символов')
            .should('exist')

        cy.contains('Введите не менее 2 и не более 500 символов')
            .should('exist')

    })

    it.skip('Альтернативный сценарий - максимальное количество символов текстовых полей', () => {

        cy.get('input[name="videoName"]')
            .clear()
            .type('testtesttesttesttesttesttesttesttesttesttesttestеtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttestte')
        
        cy.get('textarea[name="videoTranscript"]')
            .clear()
            .type('testtesttesttesttesttesttesttesttesttesttesttesttestеtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttetesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttestte')

        cy.contains('Создано на Новой Платформе')
            .click()

        cy.contains('Я являюсь автором')
            .click()

        cy.get('textarea[name="videoSource"]')
            .clear()
            .type('testtesttesttesttesttesttesttesttesttesttesttesttestеtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttetesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttestte')

        cy.get('textarea[name="authorName"]')
            .clear()
            .type('еуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыеееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееу')

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Введите не менее 2 и не более 250 символов')
            .should('exist')

        cy.contains('Введите не менее 2 и не более 500 символов')
            .should('exist')

    })
    it.skip('Альтернативный сценарий - валидация текстового поля "имя автора" ', () => {

        cy.contains('Я являюсь автором')
            .click()

        cy.get('textarea[name="authorName"]')
            .clear()
            .type('nз.)&')

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Используются некорректные символы')
            .should('exist')

    })
})