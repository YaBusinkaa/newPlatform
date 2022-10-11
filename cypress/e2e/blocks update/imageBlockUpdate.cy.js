describe('Image block update testing', () => {

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
        cy.createBlockImage('testBlock','id_task, id_block')

        
        // cy.intercept({
        //     method: 'POST',
        //     url: '**/block/image**',
        // }).as('matchedCreateImage')                           

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth')  

        cy.intercept({
            method: 'POST',
            url: 'https://uploader.ipst-dev.com/image/upload',
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


    it('Основной сценарий - создание блока изображения', () => {
   
        cy.get('input[id="icon-button-file"]')
        .attachFile('testImage.jpg')
        cy.wait('@matchedUploader')

        cy.get('input[name="imageName"]')
        .type(Cypress.env('nameImage'))

        cy.contains('Создано на Новой Платформе')
        .click()

        cy.contains('Я являюсь автором')
        .click()

        cy.get('button[type="submit"]')
        .click()

        cy.contains('Ваше изображение '+Cypress.env('nameImage')+' успешно добавлено')
        .should('exist')
    })


    it.skip('Альтернативный сценарий - пустые поля', () => {
        
        cy.get('button[type="submit"]')
        .click()

        cy.contains('Загрузите медиафайл')
        .should('exist')

        cy.contains('Введите название изображения')
        .should('exist')

        cy.contains('Необходимо указать источник заимствования')
        .should('exist')

        cy.contains('Необходимо указать имя автора')
        .should('exist')
    })

    it.skip('Альтернативный сценарий - неверный формат', () => {
        
        cy.get('input[id="icon-button-file"]')
        .attachFile('testAudio.mp3')
        // cy.wait('@matchedUploader')

        cy.contains('Допустимые форматы фото: png/jpg/jpeg')
        .should('exist')
    })

    it.skip('Альтернативный сценарий - размер файла превышает допустимый', () => {
        
        cy.get('input[id="icon-button-file"]')
        .attachFile('bigImage.png')
        // cy.wait('@matchedUploader')

        cy.contains('Размер фото превышает максимально допустимый объем равный 5 Мб')
        .should('exist')
    })

    it.skip ('Альтернативный сценарий - минимальное количество символов текстовых полей', () => {

        cy.get('input[id="icon-button-file"]')
            .attachFile('testImage.jpg')
        cy.wait('@matchedUploader')

        cy.get('input[name="imageName"]')
            .type('а')

        cy.get('textarea[name="imageSource"]')
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
    it.skip('Альтернативный сценарий - максимальное количество символов текстовых полей', () => {

        cy.get('input[id="icon-button-file"]')
            .attachFile('testImage.jpg')
        cy.wait('@matchedUploader')

        cy.get('input[name="imageName"]')
            .type('testtesttesttesttesttesttesttesttesttesttesttestеtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttestte')

        cy.get('textarea[name="imageSource"]')
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