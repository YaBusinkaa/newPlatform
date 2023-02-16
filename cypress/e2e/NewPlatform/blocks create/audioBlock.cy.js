describe('Audio block testing', () => {

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


        cy.intercept({
            method: 'POST',
            url: '**/block/audio**',
        }).as('matchedCreateAudio')

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth')

        cy.intercept({
            method: 'POST',
            url: 'https://uploader.ipst-dev.com/audio/upload',
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

        cy.contains('Для создания блока добавьте материал из меню слева или нажмите на кнопку')
            .click()
            .wait(500)

        cy.contains('Аудио')
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


    it('Основной сценарий - создание блока аудио', () => {

        cy.get('input[id="icon-button-file"]')
            .attachFile('testAudio.mp3')
        cy.wait('@matchedUploader').then(({response}) => {
            expect(response.statusCode).to.eq(200)
        })

        cy.get('input[name="audioName"]')
            .type('aa')

        cy.get('textarea[name="audioTranscript"]')
            .type('aa')

        cy.contains('Создано на Новой Платформе')
            .click()

        cy.contains('Я являюсь автором')
            .click()

        cy.get('button[type="submit"]')
            .click()

        cy.wait('@matchedCreateAudio')
        cy.wait(1000)
        cy.contains('Ваше аудио aa успешно добавлено')
            .should('exist')
    })


    it('Альтернативный сценарий - пустые поля', () => {

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Загрузите аудиофайл')
            .should('exist')

        cy.contains('Поле "Название аудио" не должно быть пустым')
            .should('exist')

        cy.contains('Необходимо указать источник заимствования')
            .should('exist')

        cy.contains('Необходимо указать имя автора')
            .should('exist')
    })

    it('Альтернативный сценарий - неверный формат', () => {

        cy.get('input[id="icon-button-file"]')
            .attachFile('testImage.jpg')
        // cy.wait('@matchedUploader')

        cy.contains('Допустимые форматы аудио: MP3')
            .should('exist')
    })

    it('Альтернативный сценарий - размер файла превышает допустимый', () => {

        cy.get('input[id="icon-button-file"]')
            .attachFile('bigAudio.mp3')
        // cy.wait('@matchedUploader')

        cy.contains('Размер аудио превышает максимально допустимый объем равный 10 Мб')
            .should('exist')
    })

    it('Альтернативный сценарий - минимальное количество символов текстовых полей', () => {

        cy.get('input[id="icon-button-file"]')
            .attachFile('testAudio.mp3')
       // cy.wait('@matchedUploader')

        cy.get('input[name="audioName"]')
            .type('а')

        cy.get('textarea[name="audioSource"]')
            .type('а')

        cy.get('textarea[name="authorName"]')
            .type('а')

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Введите не менее 2 и не более 250 символов')
            .should('exist')

        cy.contains('Введите не менее 2 и не более 500 символов')
            .should('exist')

    })
    it('Альтернативный сценарий - максимальное количество символов текстовых полей', () => {

        cy.get('input[id="icon-button-file"]')
            .attachFile('testImage.jpg')
        //cy.wait('@matchedUploader')

        cy.get('input[name="audioName"]')
            .type('testtesttesttesttesttesttesttesttesttesttesttestеtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttestte')

        cy.get('textarea[name="audioSource"]')
            .type('testtesttesttesttesttesttesttesttesttesttesttesttestеtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttetesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttestte')

        cy.get('textarea[name="authorName"]')
            .type('еуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыеееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееуыееу')

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Введите не менее 2 и не более 250 символов')
            .should('exist')

        cy.contains('Введите не менее 2 и не более 500 символов')
            .should('exist')

    })
})