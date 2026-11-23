// Exemplar-based (Criminisi-style) inpainting. usage: inpaint in.ppm state.pgm out.ppm outmask.pgm half R step
// state: 0 = known + usable as source, 128 = known, not a source, 255 = target (to fill), 64 = ignore (unknown, left alone)
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
static int W,H,HALF;
static unsigned char *img,*st,*kn; static float *conf,*gray,*prio; static unsigned char *srcok;
static unsigned char* readpnm(const char*p,int ch,int*w,int*h){FILE*f=fopen(p,"rb");if(!f){perror(p);exit(1);}char m[3];int mx;if(fscanf(f,"%2s %d %d %d",m,w,h,&mx)!=4){fprintf(stderr,"bad pnm %s\n",p);exit(1);}fgetc(f);unsigned char*d=malloc((size_t)(*w)*(*h)*ch);if(fread(d,1,(size_t)(*w)*(*h)*ch,f)!=(size_t)(*w)*(*h)*ch){fprintf(stderr,"short %s\n",p);exit(1);}fclose(f);return d;}
static inline int inb(int x,int y){return x>=0&&y>=0&&x<W&&y<H;}
static inline int isfront(int x,int y){int i=y*W+x; if(kn[i]||st[i]!=255) return 0;
  return (x>0&&kn[i-1])||(x<W-1&&kn[i+1])||(y>0&&kn[i-W])||(y<H-1&&kn[i+W]);}
static float cterm(int x,int y){double s=0;for(int dy=-HALF;dy<=HALF;dy++)for(int dx=-HALF;dx<=HALF;dx++){int xx=x+dx,yy=y+dy;if(inb(xx,yy)&&kn[yy*W+xx])s+=conf[yy*W+xx];}return s/((2*HALF+1)*(2*HALF+1));}
static float dterm(int x,int y){
  float nx=(inb(x+1,y)?kn[y*W+x+1]:0)-(inb(x-1,y)?kn[y*W+x-1]:0), ny=(inb(x,y+1)?kn[(y+1)*W+x]:0)-(inb(x,y-1)?kn[(y-1)*W+x]:0);
  // smoother normal from 5x5
  float sx=0,sy=0;for(int dy=-2;dy<=2;dy++)for(int dx=-2;dx<=2;dx++){int xx=x+dx,yy=y+dy;if(inb(xx,yy)&&kn[yy*W+xx]){sx+=dx;sy+=dy;}}
  nx=sx;ny=sy;float nl=sqrtf(nx*nx+ny*ny);if(nl<1e-6f)return 0.001f;nx/=nl;ny/=nl;
  float best=0,bx=0,by=0;
  for(int dy=-HALF;dy<=HALF;dy++)for(int dx=-HALF;dx<=HALF;dx++){int xx=x+dx,yy=y+dy;if(xx<1||yy<1||xx>=W-1||yy>=H-1)continue;int i=yy*W+xx;
    if(!(kn[i]&&kn[i-1]&&kn[i+1]&&kn[i-W]&&kn[i+W]))continue;
    float gx=(gray[i+1]-gray[i-1])*0.5f,gy=(gray[i+W]-gray[i-W])*0.5f;float m=gx*gx+gy*gy;if(m>best){best=m;bx=gx;by=gy;}}
  float d=fabsf(-by*nx+bx*ny)/255.0f; return d+0.001f;}
static void upd(int x,int y){int i=y*W+x; if(isfront(x,y)) prio[i]=cterm(x,y)*dterm(x,y); else prio[i]=-1;}
int main(int argc,char**argv){
  if(argc<8){fprintf(stderr,"usage\n");return 1;}
  int w2,h2;img=readpnm(argv[1],3,&W,&H);st=readpnm(argv[2],1,&w2,&h2);if(w2!=W||h2!=H){fprintf(stderr,"size mismatch\n");return 1;}
  HALF=atoi(argv[5]);int R0=atoi(argv[6]),step=atoi(argv[7]);float slope=argc>8?atof(argv[8]):0;int vmax=argc>9?atoi(argv[9]):0;int CH=argc>10?atoi(argv[10]):HALF;if(CH>HALF)CH=HALF;
  size_t N=(size_t)W*H;kn=malloc(N);conf=malloc(N*sizeof(float));gray=malloc(N*sizeof(float));prio=malloc(N*sizeof(float));srcok=calloc(N,1);
  long ntarget=0;
  for(size_t i=0;i<N;i++){kn[i]=(st[i]==0||st[i]==128);conf[i]=kn[i]?1.0f:0.0f;gray[i]=(img[3*i]+img[3*i+1]+img[3*i+2])/3.0f;if(st[i]==255)ntarget++;}
  // srcok via integral image of non-source
  int *I=calloc((size_t)(W+1)*(H+1),sizeof(int));
  for(int y=0;y<H;y++)for(int x=0;x<W;x++)I[(y+1)*(W+1)+x+1]=(st[y*W+x]!=0)+I[y*(W+1)+x+1]+I[(y+1)*(W+1)+x]-I[y*(W+1)+x];
  for(int y=HALF;y<H-HALF;y++)for(int x=HALF;x<W-HALF;x++){int x0=x-HALF,y0=y-HALF,x1=x+HALF+1,y1=y+HALF+1;int s=I[y1*(W+1)+x1]-I[y0*(W+1)+x1]-I[y1*(W+1)+x0]+I[y0*(W+1)+x0];srcok[y*W+x]=(s==0);}
  free(I);
  int bx0=W,by0=H,bx1=0,by1=0;for(int y=0;y<H;y++)for(int x=0;x<W;x++)if(st[y*W+x]==255){if(x<bx0)bx0=x;if(x>bx1)bx1=x;if(y<by0)by0=y;if(y>by1)by1=y;}
  for(int y=0;y<H;y++)for(int x=0;x<W;x++)prio[y*W+x]=-1;
  for(int y=by0;y<=by1;y++)for(int x=bx0;x<=bx1;x++)upd(x,y);
  long filled=0,iter=0;unsigned rs=12345;
  while(1){
    float bp=-1;int px=-1,py=-1;
    for(int y=by0;y<=by1;y++){float*r=prio+y*W;for(int x=bx0;x<=bx1;x++)if(r[x]>bp){bp=r[x];px=x;py=y;}}
    if(px<0)break;
    float cp=cterm(px,py);
    // search
    long best=-1;int qx=-1,qy=-1;int R=R0;
    while(1){int cnt=0;rs=rs*1664525u+1013904223u;int ox=(rs>>16)%step,oy=(rs>>20)%step;
      for(int cx=px-R+ox;cx<=px+R;cx+=step){if(cx<HALF||cx>=W-HALF)continue;
        int ya=py-R+oy,yb=py+R,ys=step; if(vmax>0){int yc=(int)lroundf(py+slope*(cx-px));ya=yc-vmax;yb=yc+vmax;ys=1;}
        for(int cy=ya;cy<=yb;cy+=ys){if(cy<HALF||cy>=H-HALF)continue;if(!srcok[cy*W+cx])continue;cnt++;
          long s=0;
          for(int dy=-HALF;dy<=HALF;dy++){int ty=py+dy;if(ty<0||ty>=H)continue;
            for(int dx=-HALF;dx<=HALF;dx++){int tx=px+dx;if(tx<0||tx>=W)continue;int ti=ty*W+tx;if(!kn[ti])continue;int ci=(cy+dy)*W+cx+dx;
              int d0=img[3*ti]-img[3*ci],d1=img[3*ti+1]-img[3*ci+1],d2=img[3*ti+2]-img[3*ci+2];s+=d0*d0+d1*d1+d2*d2;}
            if(best>=0&&s>best)break;}
          if(best<0||s<best){best=s;qx=cx;qy=cy;}
        }}
      if(cnt>=60||R>W+H)break;R*=2;}
    if(qx<0){ // nothing to copy from: give up on this pixel
      st[py*W+px]=64;prio[py*W+px]=-1;for(int dy=-1;dy<=1;dy++)for(int dx=-1;dx<=1;dx++)if(inb(px+dx,py+dy))upd(px+dx,py+dy);continue;}
    for(int dy=-CH;dy<=CH;dy++){int ty=py+dy;if(ty<0||ty>=H)continue;for(int dx=-CH;dx<=CH;dx++){int tx=px+dx;if(tx<0||tx>=W)continue;int ti=ty*W+tx;
      if(kn[ti]||st[ti]!=255)continue;int ci=(qy+dy)*W+qx+dx;img[3*ti]=img[3*ci];img[3*ti+1]=img[3*ci+1];img[3*ti+2]=img[3*ci+2];gray[ti]=(img[3*ti]+img[3*ti+1]+img[3*ti+2])/3.0f;kn[ti]=1;conf[ti]=cp;filled++;}}
    int m=2*HALF+2;for(int y=py-m;y<=py+m;y++)for(int x=px-m;x<=px+m;x++)if(inb(x,y))upd(x,y);
    if((++iter)%2000==0)fprintf(stderr,"iter %ld filled %ld/%ld\n",iter,filled,ntarget);
  }
  fprintf(stderr,"done iter %ld filled %ld/%ld\n",iter,filled,ntarget);
  FILE*f=fopen(argv[3],"wb");fprintf(f,"P6\n%d %d\n255\n",W,H);fwrite(img,1,N*3,f);fclose(f);
  f=fopen(argv[4],"wb");fprintf(f,"P5\n%d %d\n255\n",W,H);for(size_t i=0;i<N;i++){unsigned char v=kn[i]?255:0;fwrite(&v,1,1,f);}fclose(f);
  return 0;}
