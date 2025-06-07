import './Support.scss';

export default function Support() {
  return (
    <>
      <h1 className="support-title">Техническая поддержка</h1>
      <p className="support-description">
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
