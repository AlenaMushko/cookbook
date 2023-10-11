import { EEmailAction } from "../enums";

export const templates = {
  [EEmailAction.REGISTER]: {
    templateName: "register",
    subject: "Раді вітати вас в CookBook",
  },
  [EEmailAction.FORGOT_PASSWORD]: {
    templateName: "forgot-password",
    subject: "Не переживайте, ми контролюємо ваш пароль",
  },
  [EEmailAction.RESET_PASSWORD]: {
    templateName: "reset-password",
    subject: "Вітаю, ви успішно відновили ваш пароль",
  },
  [EEmailAction.WELCOME]: {
    templateName: "welcome",
    subject: "Вітаю,ви успішно верифікувалися",
  },
};
