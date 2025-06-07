import './Support.scss';

export default function Support() {
  return (
    <>
      <h1>Техническая поддержка</h1>
      <p className="description">
        Здесь Вы можете оставить свой вопрос
        <br /> и наши специалисты свяжутся с Вами
      </p>

      <form className="support-form">
        <div>
          <label htmlFor="question">Оставить свой вопрос</label>
          <textarea
            name="question"
            id="question"
          ></textarea>
        </div>

        <button>Отправить</button>
      </form>


    </>
  );
}
