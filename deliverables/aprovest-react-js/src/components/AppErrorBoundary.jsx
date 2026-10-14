import { Component } from "react";

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      error,
    };
  }

  componentDidCatch(error, information) {
    console.error("Erro inesperado no AproVest:", error, information);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="startup-error">
          <section className="panel">
            <span className="kicker">ERRO DE INICIALIZAÇÃO</span>
            <h1>O AproVest não conseguiu abrir</h1>
            <p>
              Reinicie o servidor. Se o problema continuar, consulte o terminal para identificar o
              arquivo que precisa de correção.
            </p>
            <button className="btn primary" type="button" onClick={() => window.location.reload()}>
              Tentar novamente
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
