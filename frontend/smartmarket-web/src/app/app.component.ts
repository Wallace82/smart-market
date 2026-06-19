import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  title = 'smartmarket-web';

  ngOnInit() {
    this.setupPushNotifications();
  }

  private async setupPushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Este navegador não suporta Service Worker ou Push Notifications.');
      return;
    }

    try {
      // 1. Obter ou gerar Client ID persistente para testes locais
      let clientId = localStorage.getItem('sm_client_id');
      if (!clientId) {
        clientId = this.generateUUID();
        localStorage.setItem('sm_client_id', clientId);
      }
      console.log('SmartMarket Client ID:', clientId);

      // 2. Registrar Service Worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado com sucesso:', registration);

      // 3. Solicitar permissão de Notificações
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Permissão de notificação negada pelo usuário.');
        return;
      }

      // 4. Buscar chave pública VAPID do backend
      const vapidResponse = await fetch('/api/v1/notifications/vapid/public-key');
      if (!vapidResponse.ok) {
        throw new Error('Falha ao buscar chave pública VAPID do backend');
      }
      const vapidData = await vapidResponse.json();
      const publicKey = vapidData.publicKey;

      // 5. Verificar se já existe uma inscrição ativa
      let subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Obter a chave pública antiga e comparar com a nova key
        const oldKeyBuffer = subscription.options.applicationServerKey;
        if (oldKeyBuffer) {
          const oldKeyBytes = new Uint8Array(oldKeyBuffer);
          const newKeyBytes = this.urlBase64ToUint8Array(publicKey);
          
          // Verificar se as chaves são idênticas
          let keysMatch = oldKeyBytes.length === newKeyBytes.length;
          if (keysMatch) {
            for (let i = 0; i < oldKeyBytes.length; i++) {
              if (oldKeyBytes[i] !== newKeyBytes[i]) {
                keysMatch = false;
                break;
              }
            }
          }
          
          if (!keysMatch) {
            console.log('Chave VAPID alterada no backend. Cancelando inscrição anterior...');
            await subscription.unsubscribe();
            subscription = null;
          }
        } else {
          // Se não há chave configurada na inscrição antiga, cancela para assinar novamente
          await subscription.unsubscribe();
          subscription = null;
        }
      }

      if (!subscription) {
        console.log('Criando nova inscrição Web Push...');
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(publicKey) as any
        });
      }

      // 6. Converter chaves para Base64 de forma compatível com TypeScript
      const p256dhBuffer = subscription.getKey('p256dh');
      const authBuffer = subscription.getKey('auth');
      
      let p256dh = '';
      if (p256dhBuffer) {
        const bytes = new Uint8Array(p256dhBuffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        p256dh = btoa(binary);
      }

      let auth = '';
      if (authBuffer) {
        const bytes = new Uint8Array(authBuffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        auth = btoa(binary);
      }

      // 7. Enviar inscrição de push para o backend
      const subscribeResponse = await fetch('/api/v1/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId: clientId,
          endpoint: subscription.endpoint,
          authKey: auth,
          p256dhKey: p256dh
        })
      });

      if (subscribeResponse.ok) {
        console.log('Inscrição de push registrada no backend com sucesso!');
        // 8. Iniciar Simulação de Geofencing
        this.startGeofencingSimulation(clientId);
      } else {
        console.error('Falha ao registrar inscrição de push no backend.');
      }

    } catch (error) {
      console.error('Erro ao configurar Web Push no frontend:', error);
    }
  }

  private startGeofencingSimulation(clientId: string) {
    if (!('geolocation' in navigator)) return;

    // Envia a coordenada atual uma vez na inicialização para avaliar geofencing
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const payload = {
          clientId: clientId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          eventAt: new Date().toISOString()
        };

        console.log('Enviando coordenadas para simular Geofencing:', payload);
        
        try {
          const geofenceResponse = await fetch('/api/v1/geofence/evaluate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
          if (geofenceResponse.status === 202) {
             console.log('Coordenadas recebidas pelo Geofencing, aguardando disparo...');
          }
        } catch (e) {
          console.error('Erro ao enviar coordenadas de geofencing:', e);
        }
      },
      (error) => {
        console.warn('Permissão de geolocalização negada. Não foi possível avaliar geofencing automático:', error);
      }
    );
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
