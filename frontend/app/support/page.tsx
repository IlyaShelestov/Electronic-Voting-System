import "./Support.scss";
export default function Support() {
  return (
    <>
      <h1>Техническая поддержка</h1>
      <p className="description">
        Здесь Вы можете оставить свой вопрос
        <br /> и наши специалисты свяжутся с Вами
      </p>

      <form>
        <div>
          <label htmlFor="question">Оставить свой вопрос</label>
          <textarea
            name="question"
            id="question"
          ></textarea>
        </div>

        <button>Отправить</button>
      </form>

      <div className="contacts">
        <p>Вы также можете связаться с нами следующими методами</p>
        <p>
          <a href="tel:+77172112233">+7 (7172) 11-22-33</a> |{" "}
          <a href="mail:example@mail.com">example@mail.com</a> |{" "}
          <a href="#">Telegram Bot</a>
        </p>
      </div>
    </>
  );
}
