<template>
  <div
    class="relative mx-auto aspect-[560/680] w-full max-w-[330px] sm:max-w-[420px] lg:max-w-[500px] xl:max-w-[540px] 2xl:max-w-[640px]"
  >
    <!-- Circles -->
    <div
      class="absolute left-[42.86%] top-[7.35%] aspect-square w-[53.57%] animate-pop-in"
      style="animation-delay: 0.15s"
      aria-hidden="true"
    >
      <div
        class="size-full animate-breathe rounded-full bg-art-1 will-change-transform"
      />
    </div>
    <div
      class="absolute left-[0.89%] top-[33.82%] aspect-square w-[75%] animate-pop-in"
      style="animation-delay: 0.3s"
      aria-hidden="true"
    >
      <div
        class="size-full animate-breathe rounded-full bg-art-1 will-change-transform"
        style="animation-delay: -3s"
      />
    </div>
    <div
      class="absolute left-[40.18%] top-[41.91%] aspect-square w-[58.93%] animate-pop-in"
      style="animation-delay: 0.45s"
      aria-hidden="true"
    >
      <div
        class="size-full animate-breathe rounded-full bg-art-2 will-change-transform"
        style="animation-delay: -6s"
      />
    </div>

    <!-- Corner squares (top-left, bottom-right): each group floats as one layer -->
    <div
      class="pointer-events-none absolute inset-0 animate-float will-change-transform"
      aria-hidden="true"
    >
      <span
        class="absolute left-[7.14%] top-[4.41%] aspect-square w-[10.36%] rounded-[24%] bg-art-1"
      />
      <span
        class="absolute left-[-3.21%] top-[12.65%] aspect-square w-[10.36%] rounded-[24%] bg-art-1"
      />
      <span
        class="absolute left-[10.36%] top-[14.41%] aspect-square w-[10.36%] rounded-[24%] bg-art-1"
      />
    </div>
    <div
      class="pointer-events-none absolute inset-0 animate-float will-change-transform"
      style="animation-delay: -3.5s"
      aria-hidden="true"
    >
      <span
        class="absolute left-[81.25%] top-[82.35%] aspect-square w-[10.36%] rounded-[24%] bg-art-2"
      />
      <span
        class="absolute left-[94.82%] top-[82.35%] aspect-square w-[10.36%] rounded-[24%] bg-art-2"
      />
      <span
        class="absolute left-[84.64%] top-[92.35%] aspect-square w-[10.36%] rounded-[24%] bg-art-2"
      />
    </div>

    <div
      class="absolute bottom-[2%] left-[25%] aspect-[668/1500] h-[92%] xl:left-[45%]"
    >
      <div class="size-full animate-fade-up" style="animation-delay: 0.35s">
        <div
          class="size-full animate-bob will-change-transform backface-hidden"
        >
          <!-- The drop-shadow sits on the image, which never moves by itself: only its parent layer does -->
          <img
            src="/images/profile.webp"
            width="668"
            height="1500"
            :alt="$t('a11y.portrait')"
            fetchpriority="high"
            class="size-full max-w-none select-none drop-shadow-[0_18px_24px_rgba(0,0,0,0.28)]"
            draggable="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>
