describe('Exercise block testing', () => {

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
            url: '**/block/exercise**',
        }).as('matchedCreateExercise')

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth')

        cy.intercept({
            method: 'POST',
            url: 'https://uploader.ipst-dev.com/audio/upload',
        }).as('matchedUploaderAudio')

        cy.intercept({
            method: 'POST',
            url: 'https://uploader.ipst-dev.com/image/upload',
        }).as('matchedUploaderImage')

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

        cy.contains('Упражнение')
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


    it.skip('Основной сценарий - создание упражнения с изображением', () => {

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
        cy.wait('@matchedUploaderImage').then(({response}) => {
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

        cy.get('textarea[name="answer"]')
            .eq(0)
            .type('aa')

        cy.get('textarea[name="answer"]')
            .eq(1)
            .type('aa')

        cy.get('input[name="hint"]')
            .eq(0)
            .type('aa')

        cy.contains('СОХРАНИТЬ')
            .click()
            
        cy.wait('@matchedCreateExercise')

        cy.wait(1000)

        cy.contains('Упражнение aa успешно создано')
            .should('exist')

    })

    it.skip('Альтернативный сценарий - пустые поля добавление общей информации', () => {

        //добавление общей информации

        
        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Введите название упражнения')
            .should('exist')
        
    })

    it.skip('Альтернативный сценарий - пустые поля добавление медиафайла', () => {

        //добавление медиафайла

        cy.get('input[name="title"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('ДАЛЕЕ')
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

    it.skip('Альтернативный сценарий - пустые поля добавление видеофайла', () => {

        //добавление медиафайла

        cy.get('input[name="title"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Загрузить видео')
            .click()

        cy.contains('ДАЛЕЕ')
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

    it.skip('Альтернативный сценарий - пустые поля добавление аудиофайла', () => {

        //добавление медиафайла

        cy.get('input[name="title"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Загрузить аудио')
            .click()

        cy.contains('ДАЛЕЕ')
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

    it.skip('Альтернативный сценарий - пустые поля добавление задания (множественный выбор)', () => {

        //добавление задания
    
        cy.get('input[name="title"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Продолжить без медиафайла')
            .click()

        cy.contains('Множественный выбор')
            .click()

        cy.contains('добавить')
            .click()

        cy.get('input[type=checkbox]')
            .eq(0)
            .click()

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait(1000)

        cy.contains('Необходимо заполнить обязательные поля')
            .should('exist')

    })

    it.skip('Альтернативный сценарий - пустые поля добавление задания (одиночный выбор)', () => {

        //добавление задания
    
        cy.get('input[name="title"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Продолжить без медиафайла')
            .click()

        cy.get('input[type=checkbox]')
            .eq(0)
            .click()

        cy.contains('добавить')
            .click()

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait(1000)

        cy.contains('Необходимо заполнить обязательные поля')
            .should('exist')

    })
    
    it.skip('Альтернативный сценарий - количество ответов меньше 2 (одиночный выбор)', () => {

        //добавление задания
    
        cy.get('input[name="title"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Продолжить без медиафайла')
            .click()

        cy.contains('Одиночный выбор')
            .click()

        cy.get('input[name="answer"]')
            .type('aa')

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait(1000)

        cy.contains('Нужно минимум два варианта ответа')
            .should('exist')

    })

    it('Альтернативный сценарий - количество ответов меньше 2 (множественный выбор)', () => {

        //добавление задания
    
        cy.get('input[name="title"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Продолжить без медиафайла')
            .click()

        cy.contains('Множественный выбор')
            .click()

        cy.get('textarea[name="answer"]')
            .eq(0)
            .type('aa')

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait(1000)

        cy.contains('Нужно минимум два варианта ответа')
            .should('exist')
    })

    it('(добавление медиафайла) - минимальное количество символов, неверный формат медиафайла', () => {

        //добавление задания
    
        cy.get('input[name="title"]')
            .type('a')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Название упражнения не должно быть менее 2 и более 250 символов')
            .should('exist')
        
        cy.get('input[name="title"]')
            .type('a')
        
            cy.contains('ДАЛЕЕ')
            .click()

        cy.get('input[id="icon-button-file"]')
            .attachFile('testAudio.mp3')

        // cy.wait('@matchedUploaderImage').then(({response}) => {
        //     expect(response.statusCode).to.eq(200)
        // })

        cy.get('input[name="imageName"]')
            .type('a')

        cy.get('textarea[name="imageSource"]')
            .type('a')

        cy.get('textarea[name="authorName"]')
            .type('а')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.wait(1000)

        cy.contains('Допустимые форматы фото: png/jpg/jpeg')
            .should('exist')

        cy.contains('Введите не менее 2 и не более 250 символов')
            .should('exist')

        cy.contains('Введите не менее 2 и не более 250 символов')
            .should('exist')

        cy.contains('Введите не менее 2 и не более 500 символов')
            .should('exist')

    })

    it('(добавление медиафайла) - неверный формат аудиофайла', () => {

        //добавление задания
    
        cy.get('input[name="title"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Загрузить аудио')
            .click()
        
        cy.get('input[id="icon-button-file"]')
            .attachFile('testImage.jpg')

        // cy.wait('@matchedUploaderImage').then(({response}) => {
        //     expect(response.statusCode).to.eq(200)
        // })

        cy.get('input[name="audioName"]')
            .type('aa')

        cy.get('textarea[name="audioSource"]')
            .type('aa')

        cy.get('textarea[name="authorName"]')
            .type('аа')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.wait(1000)

        cy.contains('Допустимые форматы аудио: MP3')
        .should('exist')

    })

    it('(добавление медиафайла) - неверный формат видеофайла', () => {

        //добавление задания
    
        cy.get('input[name="title"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Загрузить видео')
            .click()
        
        cy.get('input[id="icon-button-file"]')
            .attachFile('testImage.jpg')

        // cy.wait('@matchedUploaderImage').then(({response}) => {
        //     expect(response.statusCode).to.eq(200)
        // })

        cy.get('input[name="videoName"]')
            .type('aa')

        cy.get('textarea[name="videoSource"]')
            .type('aa')

        cy.get('textarea[name="authorName"]')
            .type('аа')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.wait(1000)

        cy.contains('Допустимые форматы видео: MP4')
        .should('exist')

    })

    it('(добавление медиафайла) - недопустимый размер медиафайла', () => {

        //добавление задания
    
        cy.get('input[name="title"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.get('input[id="icon-button-file"]')
            .attachFile('bigImage.png')

        // cy.wait('@matchedUploaderImage').then(({response}) => {
        //     expect(response.statusCode).to.eq(200)
        // })

        cy.contains('ДАЛЕЕ')
            .click()

        cy.wait(1000)

        cy.contains('Размер фото превышает максимально допустимый объем равный 5 Мб')
            .should('exist')
    })

    it('(добавление медиафайла) - недопустимый размер аудиофайла', () => {

        //добавление задания
    
        cy.get('input[name="title"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Загрузить аудио')
            .click()
        
        cy.get('input[id="icon-button-file"]')
            .attachFile('bigAudio.mp3')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.wait(1000)

        cy.contains('Размер аудио превышает максимально допустимый объем равный 10 Мб')
            .should('exist')

    })

    it('(добавление медиафайла) - недопустимый размер видеофайла ', () => {

        //добавление задания
    
        cy.get('input[name="title"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Загрузить видео')
            .click()
        
        cy.get('input[id="icon-button-file"]')
            .attachFile('bigVideo.mp4')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.wait(1000)

        cy.contains('Размер видео превышает максимально допустимый объем равный 10 Мб')
            .should('exist')

    })
})