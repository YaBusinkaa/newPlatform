describe('Exercise update testing', () => {

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
            url: '**/block/exercise',
        }).as('matchedCreateExercise')

        cy.intercept({
            method: 'PUT',
            url: '**/exercises/**',
        }).as('matchedUpdateExercise')

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

//добавление общей информации
        cy.get('input[name="title"]')
            .type('testExercise')

        cy.get('textarea[name="text"]')
            .type('test')

        cy.get('textarea[name="task"]')
            .type('test')

        cy.contains('ДАЛЕЕ')
            .click()

//добавление медиафайла

        cy.get('input[id="icon-button-file"]')
            .attachFile('testImage.jpg')
        cy.wait('@matchedUploaderImage').then(({response}) => {
            expect(response.statusCode).to.eq(200)
        })

        cy.get('input[name="imageName"]')
            .type('test')

        cy.contains('Создано на Новой Платформе')
            .click()

        cy.contains('Я являюсь автором')
            .click()

        cy.contains('ДАЛЕЕ')
            .click()
        
//добавление задания

        cy.get('textarea[name="text"]')
            .type('test')

        cy.get('input[name="answer"]')
            .eq(0)
            .type('test')

        cy.contains('добавить')
            .click()

        cy.get('input[name="answer"]')
            .eq(1)
            .type('test')

        cy.get('input[name="hint"]')
            .eq(0)
            .type('test')

        cy.contains('СОХРАНИТЬ')
            .click()
            
        cy.wait('@matchedCreateExercise')

        cy.wait(1000)

        cy.contains('Упражнение testExercise успешно создано')
            .should('exist')

        //cy.contains('testExercise')

            cy.get('[data-testid="EditIcon"]')
                .eq(3)
            .click()
            .wait(500)
        
    })

    afterEach(() =>{
        cy.login()
        cy.getMySubjects('testSubject')
        cy.deleteAfterSubject('id_subject')
    })


    it.skip('Основной сценарий - редактирование упражнения (обновление фото)', () => {

        //добавление общей информации
        cy.get('input[name="title"]')
            .clear()
            .type('te')

        cy.get('textarea[name="text"]')
            .clear()
            .type('te')

        cy.get('textarea[name="task"]')
            .clear()
            .type('te')

        cy.contains('ДАЛЕЕ')
            .click()

//добавление медиафайла

        cy.contains('Загрузить другое изображение')
            .click()        

        cy.get('input[id="icon-button-file"]')
            .attachFile('createExerciseImage.jpg')

        cy.wait('@matchedUploaderImage').then(({response}) => {
            expect(response.statusCode).to.eq(200)
        })

        cy.get('input[name="imageName"]')
            .clear()
            .type('te')

        cy.contains('Создано на Новой Платформе')
            .click()

        cy.contains('Я являюсь автором')
            .click()

        cy.get('textarea[name="imageSource"]')
            .clear()
            .type('аа')

        cy.get('textarea[name="authorName"]')
            .clear()
            .type('аа')

        cy.contains('ДАЛЕЕ')
            .click()
        
//добавление задания

        cy.get('textarea[name="text"]')
            .clear()
            .type('te')

        cy.get('input[name="answer"]')
            .clear()
            .eq(0)
            .type('te')

        cy.get('input[name="answer"]')
            .eq(1)
            .type('te')

        cy.get('input[name="hint"]')
            .clear()
            .eq(0)
            .type('te')

        cy.contains('СОХРАНИТЬ')
            .click()
            
        cy.wait('@matchedUpdateExercise')

        cy.wait(1000)

        cy.contains('Упражнение te успешно изменено')
            .should('exist')
        
    })

    it.skip('Альтернативный сценарий - пустые поля добавление общей информации', () => {

        cy.get('input[name="title"]')
            .clear()

        cy.get('textarea[name="text"]')
            .clear()

        cy.get('textarea[name="task"]')
            .clear()

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Введите название упражнения')
            .should('exist')
        
    })

    it.skip('Альтернативный сценарий - пустые поля добавление медиафайла', () => {

        //добавление медиафайла
        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Загрузить другое изображение')
            .click()

        cy.get('input[name="imageName"]')
            .clear()

        cy.contains('Создано на Новой Платформе')
            .click()

        cy.contains('Я являюсь автором')
            .click()

        cy.get('textarea[name="imageSource"]')
            .clear()

        cy.get('textarea[name="authorName"]')
            .clear()

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

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Множественный выбор')
            .click()

        cy.get('input[name="answer"]')
            .eq(0)
            .clear()

        cy.get('input[name="answer"]')
            .eq(1)
            .clear()

        // cy.get('input[type=checkbox]')
        //     .eq(0)
        //     .click()

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait(1000)

        cy.contains('Должно быть заполнено хотя бы одно поле и выбран верный ответ')
            .should('exist')

    })

    it.skip('Альтернативный сценарий - пустые поля добавление задания (одиночный выбор)', () => {

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('ДАЛЕЕ')
            .click()

        cy.get('input[name="answer"]')
            .eq(0)
            .clear()

        cy.get('input[name="answer"]')
            .eq(1)
            .clear()

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait(1000)

        cy.contains('Должно быть заполнено хотя бы одно поле и выбран верный ответ')
            .should('exist')

    })

    it.skip('Альтернативный сценарий - не выбраны варианты ответов добавление задания (множественный выбор)', () => {

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Множественный выбор')
            .click()

        cy.get('input[type=checkbox]')
            .eq(0)
            .click()

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait(1000)

        cy.contains('Должно быть заполнено хотя бы одно поле и выбран верный ответ')
            .should('exist')

    })

    it.skip('Альтернативный сценарий - не выбраны варианты ответов добавление задания (одиночный выбор)', () => {
        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('ДАЛЕЕ')
            .click()

        cy.get('input[type=checkbox]')
            .eq(0)
            .click()

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait(1000)

        cy.contains('Должно быть заполнено хотя бы одно поле и выбран верный ответ')
            .should('exist')

    })

    it.skip('Альтернативный сценарий - два варианта ответа добавление задания (множественный выбор)', () => {

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Множественный выбор')
            .click()

        cy.get('input[type=checkbox]')
            .eq(1)
            .click()

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait(1000)

        cy.contains('Упражнение testExercise успешно изменено')
            .should('exist')

    })

    it.skip('Альтернативный сценарий - количество ответов меньше 2 (одиночный выбор)', () => {

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Добавьте варианты ответа')
            .parent()
            .parent()
            .find('svg[data-testid="DeleteIcon"]')
            .eq(1)
            .click()
            .wait(1500)

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait(1000)

        cy.contains('Нужно минимум два варианта ответа')
            .should('exist')

    })

    it.skip('Альтернативный сценарий - количество ответов меньше 2 (множественный выбор)', () => {

        cy.get('input[name="title"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Продолжить без медиафайла')
            .click()

        cy.contains('Множественный выбор')
            .click()

        cy.contains('Добавьте варианты ответа')
            .parent()
            .parent()
            .find('svg[data-testid="DeleteIcon"]')
            .eq(1)
            .click()
            .wait(1500)

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait(1000)

        cy.contains('Нужно минимум два варианта ответа')
            .should('exist')
    })

    it.skip('(добавление медиафайла) - минимальное количество символов, неверный формат медиафайла', () => {

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Загрузить другое изображение')
            .click()

        cy.get('input[id="icon-button-file"]')
            .attachFile('testAudio.mp3')

        // cy.wait('@matchedUploaderImage').then(({response}) => {
        //     expect(response.statusCode).to.eq(200)
        // })

        cy.get('input[name="imageName"]')
            .clear()
            .type('a')

        cy.contains('Создано на Новой Платформе')
            .click()

        cy.contains('Я являюсь автором')
            .click()

        cy.get('textarea[name="imageSource"]')
            .clear()
            .type('a')

        cy.get('textarea[name="authorName"]')
            .clear()
            .type('а')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.wait(1000)

        cy.contains('Допустимые форматы фото: png/jpg')
            .should('exist')

        cy.contains('Введите не менее 2 и не более 250 символов')
            .should('exist')

        cy.contains('Введите не менее 2 и не более 250 символов')
            .should('exist')

        cy.contains('Введите не менее 2 и не более 500 символов')
            .should('exist')

    })

    it.skip('(добавление медиафайла) - минимальное количество символов, неверный формат аудиофайла', () => {

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
        .type('a')

        cy.get('textarea[name="audioSource"]')
            .type('a')

        cy.get('textarea[name="authorName"]')
            .type('а')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.wait(1000)

        cy.contains('Допустимые форматы аудио: MP3')
        .should('exist')

    })

    it.skip('(добавление медиафайла) - минимальное количество символов, неверный формат видеофайла', () => {

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
        .type('a')

        cy.get('textarea[name="videoSource"]')
            .type('a')

        cy.get('textarea[name="authorName"]')
            .type('а')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.wait(1000)

        cy.contains('Допустимые форматы видео: MP4')
        .should('exist')

    })

    it('(добавление медиафайла) - недопустимый размер медиафайла', () => {

        cy.contains('ДАЛЕЕ')
            .click()

        cy.contains('Загрузить другое изображение')
            .click()

        cy.get('input[id="icon-button-file"]')
            .attachFile('bigImage.png')

        cy.contains('ДАЛЕЕ')
            .click()

        cy.wait(1000)

        cy.contains('Размер фото превышает максимально допустимый объем равный 5 Мб')
            .should('exist')
    })

    it.skip('(добавление медиафайла) - недопустимый размер аудиофайла', () => {

        //добавление задания
 
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

    it.skip('(добавление медиафайла) - недопустимый размер видеофайла ', () => {

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