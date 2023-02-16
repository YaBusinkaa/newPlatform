describe('Exercise flilling in gaps testing', () => {

    before('Очищаю группы и предметы', () => {
        cy.login()
        cy.getMySubjects('testSubject')
        cy.deleteAfterSubject('id_subject')
    })


    beforeEach(() => {
        cy.login()
        cy.createSubject('testSubject', 'id_subject')
        cy.createGroup('testGroup', 'id_subject', 'id_group')
        cy.createLesson('testLesson', 'id_group', 'id_lesson')
        cy.createTask('testTask', 'id_lesson', 'id_task')


        cy.intercept({
            method: 'POST',
            url: '**/block/exercise**',
        }).as('matchedCreateExercise')

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl') + '/auth/me',
        }).as('matchedAuth')

        cy.intercept({
            method: 'POST',
            url: 'https://uploader.ipst-dev.com/audio/upload',
        }).as('matchedUploaderAudio')

        cy.intercept({
            method: 'POST',
            url: 'https://uploader.ipst-dev.com/image/upload',
        }).as('matchedUploaderImage')

        cy.visitGroup('id_subject', 'id_group')


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

        cy.contains('Упражнение')
            .click()
            .wait(500)

        // cy.wait('@matchedUrlCount').then(({response}) =>{
        //     expect(response.statusCode).to.eq(200)
        // })*/

    })

    afterEach(() => {
        cy.login()
        cy.getMySubjects('testSubject')
        cy.deleteAfterSubject('id_subject')
    })


    it('Основной сценарий - создание упражнения с заполнением пропусков', () => {

        //добавление общей информации
        cy.get('input[name="title"]')
            .type('aa')

        cy.get('textarea[name="text"]')
            .type('aa')

        cy.get('textarea[name="task"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        //добавление медиафайла

        cy.get('input[id="icon-button-file"]')
            .attachFile('testImage.jpg')
        cy.wait('@matchedUploaderImage').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
        })

        cy.get('input[name="imageName"]')
            .type('aa')

        cy.contains('Создано на Новой Платформе')
            .click()

        cy.contains('Я являюсь автором')
            .click()

        cy.contains('ДАЛЕЕ')
            .click()

        //добавление задания

        cy.get('textarea[name="text"]')
            .type('aa')

        cy.contains('Заполнение пропусков')
            .click()

        cy.get('textarea[placeholder="Введите текст"]')
            .type('Выбор из списка: Helen and Barbara [is; are*; was] sisters Вставка слов без прав.ответа: Helen and Barbara {{}} sisters Вставка слов с прав.ответом: {{}They are; They`re{}} sisters')
            .wait(2000)

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait('@matchedCreateExercise')

        cy.wait(1000)

        cy.contains('Упражнение aa успешно создано')
            .should('exist')

    })

    it('Альтернативный сценарий - создание упражнения с заполнением пропусков, пустые поля', () => {

        //добавление общей информации
        cy.get('input[name="title"]')
            .type('aa')

        cy.get('textarea[name="text"]')
            .type('aa')

        cy.get('textarea[name="task"]')
            .type('aa')
        //не доделано, не знаю сообщение об ошибке
        cy.contains('ДАЛЕЕ')
            .click()

        //добавление медиафайла

        cy.contains('Продолжить без медиафайла')
            .click()

        //добавление задания

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait(1000)

        cy.contains('Необходимо заполнить обязательные поля')
            .should('exist')

    })

    //макс количество символов проверю ручным, ждать пока введутся 15к символов автотестом не очень целесообразно

})