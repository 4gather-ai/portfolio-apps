import React from 'react';
import {
  Button,
  ButtonGroup,
  DatePicker,
  Form,
  FormFooter,
  FormHeader,
  FormSection,
  Label,
  TextArea,
  Textfield,
  TimePicker,
  useForm,
  useTranslation,
} from '@forge/react';


/**
 * O formulário de apontamento, usado pelo painel do item e pela folha da semana.
 *
 * Mora num arquivo próprio desde o D7, quando a segunda tela passou a precisar
 * dele. Duas cópias de um formulário que grava hora sairiam de sincronia na
 * primeira mudança de regra, e a que ficasse para trás gravaria errado sem
 * ninguém notar.
 *
 * **Usa `useForm`, e isso não é preferência de estilo — é correção de um
 * defeito visto no navegador.** Na primeira versão os campos eram controlados
 * (`value` + `setState` a cada tecla) e **só a última letra do que se digitava
 * sobrevivia**: no UI Kit 2 o componente é desenhado pelo Jira, do outro lado
 * de uma ponte assíncrona, e o `value` que volta do re-render chega depois da
 * tecla seguinte e sobrescreve o que a pessoa acabou de escrever.
 *
 * `useForm` registra os campos como **não-controlados**: o valor mora no
 * formulário, digitar não provoca re-render, e nada é sobrescrito. É o caminho
 * que a própria Atlassian expõe para isso.
 *
 * **Quem monta este componente deve passar `key`** com o id da entrada: os
 * campos são não-controlados, e sem `key` o "Edit" da segunda linha
 * reaproveitaria os valores da primeira.
 */
export const FormularioApontamento = ({ inicial, ocupado, titulo, aoSalvar, aoCancelar }) => {
  const { t } = useTranslation();
  const { handleSubmit, register, getFieldId } = useForm({ defaultValues: inicial });

  return (
    <Form onSubmit={handleSubmit(aoSalvar)}>
      {/* `FormHeader` e não um `Strong` solto: dentro do `FormSection`, o texto
          solto encostava no primeiro rótulo e saía "Log timeTime spent". */}
      <FormHeader
        title={
          titulo ||
          (inicial.id ? t('form.editar', 'Edit entry') : t('form.novo', 'Log time'))
        }
      />
      <FormSection>
        <Label labelFor={getFieldId('duracao')}>{t('form.duracao', 'Time spent')}</Label>
        <Textfield
          placeholder={t('form.duracaoExemplo', '1h 30m')}
          {...register('duracao', { required: true })}
        />

        <Label labelFor={getFieldId('data')}>{t('form.data', 'Date started')}</Label>
        <DatePicker {...register('data', { required: true })} />

        <Label labelFor={getFieldId('hora')}>{t('form.hora', 'Time started')}</Label>
        {/* `timeIsEditable` porque a lista pronta só oferece de 30 em 30
            minutos, e trabalho não começa em número redondo. */}
        <TimePicker timeIsEditable {...register('hora')} />

        <Label labelFor={getFieldId('comentario')}>{t('form.descricao', 'Description')}</Label>
        <TextArea placeholder={t('form.opcional', 'Optional')} {...register('comentario')} />
      </FormSection>

      <FormFooter>
        <ButtonGroup>
          <Button type="submit" appearance="primary" isDisabled={ocupado}>
            {inicial.id ? t('form.salvar', 'Save changes') : t('form.gravar', 'Log time')}
          </Button>
          <Button appearance="subtle" onClick={aoCancelar} isDisabled={ocupado}>
            {t('form.cancelar', 'Cancel')}
          </Button>
        </ButtonGroup>
      </FormFooter>
    </Form>
  );
};
